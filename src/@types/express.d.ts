// Realiza modificação dentro da biblioteca com o nome do arquivo
// Anexa a nova informação ao express
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    }
  }
}
