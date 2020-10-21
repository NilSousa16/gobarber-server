interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  // interface faz com que os atribudos do objeto sejam dinâmicos
  variables: ITemplateVariables;
}
