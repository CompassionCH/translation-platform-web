import BaseDAO, { FieldsMapping, generateSearchDomain, generateSearchQuery } from "./BaseDAO";
import OdooAPI from "./OdooAPI";

type Status = 'done' | 'to do' | 'to validate' | 'in progress';
type Priority = 0 | 1 | 2 | 3 | 4;

interface BaseElement {
  type: 'paragraph' | 'pageBreak';
  id: number | string;
  readonly: boolean;
};

export interface Paragraph extends BaseElement {
  type: 'paragraph';
  content: string;
  source: string;
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
  pdfUrl?: string;
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

const int = (val: string | number) => typeof val === 'string' ? parseInt(val, 10) : val;

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
   * @param reply 
   * @returns Promise<boolean>, true if successful, false otherwise
   */
  replyToComments(letter: Letter, reply: string): Promise<boolean>;

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

  /**
   * Reports an issue regarding a letter
   */
  reportIssue(letterId: string | number, issueType: string, message: string): Promise<boolean>;

  /**
   * Mark all comments as read
   * @param letter 
   */
  markCommentsAsRead(letter: Letter): Promise<boolean>;
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
      await OdooAPI.execute_kw<Letter>('correspondence', 'get_letter_info', [int(id)])
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

  async replyToComments(letter, html) {
    try {
      await OdooAPI.execute_kw('correspondence', 'reply_to_comments', [letter.id, html]);
      console.log('OK');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
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
    console.log(JSON.stringify(letter));
    try {
      const res = await OdooAPI.execute_kw<boolean>('correspondence', 'save_translation', [
        letter.id,
        letter.translatedElements,
        letter.translatorId || "None",
      ]);
      return res || false;
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

  async reportIssue(letterId, type, message) {
    try {
      await OdooAPI.execute_kw('correspondence', 'raise_translation_issue', [int(letterId), type, message]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async markCommentsAsRead(letter) {
    try {
      await OdooAPI.execute_kw('correspondence', 'mark_comments_read', [letter.id]);
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