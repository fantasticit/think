import { Renderer } from './renderer';

const renderer = new Renderer();

export const htmlToPromsemirror = (body) => {
  return renderer.render(body);
};
