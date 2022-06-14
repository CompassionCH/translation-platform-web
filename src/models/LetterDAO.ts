import BaseDAO from "./BaseDAO";
import simulator from "./simulator";

type Status = 'done' | 'to do' | 'in process' | 'to review';
type Priority = 0 | 1 | 2 | 3 | 4;

interface BaseElement {
  type: 'paragraph' | 'pageBreak';
  id: number;
};

interface Paragraph extends BaseElement {
  type: 'paragraph';
  content: string;
  comments?: string;
};

interface PageBreak extends BaseElement {
  type: 'pageBreak';
};

type Element = Paragraph | PageBreak;

export type Letter = {
  id: number;
  status: Status;
  priority: Priority;
  title: string;
  source: string;
  target: string;
  translator: string;
  date: Date;
  translatedElements: Element[];
};

const loremIpsum = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
Where does it come from?
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`;

const allTranslations: Letter[] = [...Array(100).keys()].map((i) => {

  let index = 0;
  const elements: Element[] = [];
  const nbParagraphs = Math.floor(Math.random() * 3);
  for (let i = 0; i < nbParagraphs; i++) {
    const txtStart = Math.round(Math.random() * (loremIpsum.length / 2));
    const txtEnd = txtStart + Math.round(Math.random() * (loremIpsum.length / 2));
    const text = loremIpsum.slice(txtStart, txtEnd);
    elements.push({
      id: index++,
      type: 'paragraph',
      content: text,
      comments: Math.random() > 0.8 ? 'Some random comment' : undefined,
    });

    if (Math.random() > 0.6) {
      elements.push({
        id: index++,
        type: 'pageBreak',
      });
    }
  }

  return {
    id: i,
    status: ['done', 'to do', 'in process', 'to review'][Math.floor(Math.random() * 4)] as any,
    priority: Math.floor(Math.random() * 5) as any,
    title: `letter-${i}.pdf`,
    source: ['french', 'english', 'spanish', 'portugese', 'german', 'italian'][Math.floor(Math.random() * 6)],
    target: ['french', 'english', 'spanish', 'portugese', 'german', 'italian'][Math.floor(Math.random() * 6)],
    translator: `user-${Math.round(Math.random() * 100)}`,
    date: new Date(Date.now() - (Math.round(Math.random() * 50000000000))),
    translatedElements: elements,
  };
});


const LetterDAO: BaseDAO<Letter> = {

  async listIds(params) {
    return simulator.simulateListIds(allTranslations, params, 'id');
  },

  async find(id) {
    return simulator.simulateFind(allTranslations, id, 'id');
  },

  async list(params) {
    return simulator.simulateList(allTranslations, params);
  }
};

export default LetterDAO;