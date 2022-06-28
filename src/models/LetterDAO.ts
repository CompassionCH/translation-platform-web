import { OutputBlockData, OutputData } from "@editorjs/editorjs";
import BaseDAO, { FieldsMapping, generateSearchDomain, generateSearchQuery } from "./BaseDAO";
import OdooAPI from "./OdooAPI";

type Status = 'done' | 'to do' | 'to validate' | 'in progress';
type Priority = 0 | 1 | 2 | 3 | 4;

interface BaseElement {
  type: 'paragraph' | 'pageBreak';
  id: number | string;
};

export interface Paragraph extends BaseElement {
  type: 'paragraph';
  content: string;
  comments?: string;
};

export interface PageBreak extends BaseElement {
  type: 'pageBreak';
};

export type Element = Paragraph | PageBreak;

export type Person = {
  firstName: string;
  lastName: string;
  sex: 'M' | 'F';
  age: number;
};

export type Letter = {
  id: number | string;
  status: Status;
  priority: Priority;
  title: string;
  source: string;
  target: string;
  unreadComments: boolean;
  translatorId?: number;
  lastUpdate?: Date;
  date: Date;
  translatedElements: Element[];
  child: Person,
  sponsor: Person,
};

export const letterFieldsMapping: FieldsMapping<Letter> = {
  status: { field: 'translation_status' },
  title: { field: 'name' },
  priority: { field: 'translation_priority', format: 'number' },
  unreadComments: { field: 'unread_comments', format: 'boolean' },
  date: { field: 'scanned_date', format: (v) => new Date(v) },
  source: { field: 'src_translation_lang_id.name' },
  target: { field: 'translation_language_id.name' },
  translatorId: { field: 'translator_id', format: 'number' },
};


type LetterDAOApi = {

  /**
   * Takes a letter object coming from an xml-rpc request and sanitizes it
   * @param data 
   */
  cleanLetter(data: Letter | undefined): Letter | undefined; 

  /**
   * This method will be called when an administrator replied to a comment writen by a translator
   * on a letter. It should send an email or do something
   * @param letter 
   * @param elementId 
   * @param reply 
   * @returns Promise<boolean>, true if successful, false otherwise
   */
  replyToComment(letter: Letter, elementId: string | number, reply: OutputData): Promise<boolean>;

  /**
   * Delete the given letter object
   * @param letter 
   */
  deleteLetter(letter: Letter): Promise<boolean>;

  /**
   * Put the given letter back in the to do state and restart its
   * translation process
   * @param letter 
   */
  makeTranslatable(letter: Letter): Promise<boolean>;

  /**
   * Updates the given letter, either creating or updating it
   * @param letter 
   */
  update(letter: Letter): Promise<boolean>;

  /**
   * Submits the given letter
   * @param letter 
   */
  submit(letter: Letter): Promise<boolean>;
};

const LetterDAO: BaseDAO<Letter> & LetterDAOApi = {

  async listIds(params) {
    const searchParams = generateSearchDomain(params.search, letterFieldsMapping);
    const ids = await OdooAPI.execute_kw<number[]>('correspondence', 'search', searchParams);
    if (!ids) {
      console.error('Unable to retrieve letter ids', params.search);
      return [];
    } else {
      return ids;
    }
  },

  async find(id) {
    return this.cleanLetter(
      await OdooAPI.execute_kw<Letter>('correspondence', 'get_letter_info', [typeof id === 'string' ? parseInt(id) : id])
    );
  },

  async list(params) {
    const searchParams = generateSearchQuery<Letter>(params, letterFieldsMapping);
    // Add global state
    // @ts-ignore
    searchParams[0].push(['state', '=', 'Global Partner translation queue']);
    const [letterIds, total] = await Promise.all([
      OdooAPI.execute_kw('correspondence', 'search', searchParams),
      OdooAPI.execute_kw('correspondence', 'search', [...searchParams, true]) as Promise<number>
    ]);

    const rawLetters = await OdooAPI.execute_kw<Letter[]>('correspondence', 'list_letters', [letterIds]);
    const data = (rawLetters || []).map(it => this.cleanLetter(it)) as Letter[];
    return {
      data,
      total,
    };
  },

  async replyToComment(letter, elementId, { blocks }) {

    const mappers = {
      paragraph: (item: OutputBlockData) => `<p>${item.data.text}</p>`,
      image: (item: OutputBlockData) => `<img src="${item.data.file.url}" alt="${item.data.caption}" />`,
      list: (item: OutputBlockData) => {
        const tag = item.data.style === 'ordered' ? 'ol' : 'ul';
        return `<${tag}>${item.data.items.map((it: string) => `<li>${it}</li>`).join('')}</${tag}>`;
      },
    };

    return new Promise((resolve) => {
      try {
        const html = blocks.map(it => Object.keys(mappers).includes(it.type) ? mappers[it.type as keyof typeof mappers](it) : '').join('');
        setTimeout(() => {
          console.log('Sending reply email', letter.id, elementId, html);
          resolve(true);
        }, 2000);
      } catch (e) {
        console.error(e);
        resolve(false);
      }
    });
  },

  async deleteLetter(letter) {
    try {
      await OdooAPI.execute_kw('correspondence', 'remove_local_translate', [letter.id]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async makeTranslatable(letter) {
    try {
      await OdooAPI.execute_kw('correspondence', 'resubmit_to_translation', [[letter.id]]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async update(letter) {
    try {
      await OdooAPI.execute_kw('correspondence', 'save_translation', [
        letter.id,
        letter.translatedElements,
        letter.translatorId || "None",
      ]);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async submit(letter) {
    try {
      await OdooAPI.execute_kw('correspondence', 'submit_translation', [
        letter.id,
        letter.translatedElements,
        letter.translatorId || "None",
      ]);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  cleanLetter(letter) {
    if (!letter) {
      return undefined;
    }

    return {
      ...letter,
      status: letter.status || 'to do',
      date: new Date(OdooAPI.ifNoneElse(letter.date, Date.now())),
      // @ts-ignore
      lastUpdate: OdooAPI.ifNoneElse(letter.lastUpdate) ? new Date(letter.lastUpdate) : undefined,
      translatorId: OdooAPI.ifNoneElse(letter.translatorId),
      translatedElements: OdooAPI.ifNoneElse(letter.translatedElements, []),
    };
  }
};

export default LetterDAO;