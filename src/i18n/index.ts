import fr from './fr';

export default (str: string) => {
  return fr[str] || str;
};