const tokens = [];

export interface TokenData {
  userId: number;
  expiresAt: number;
  roles: string[];
}

export default class TokenService {
  /**
   * Atribui dados a um token no servidor de autenticação
   * @param token Token para atribuir os dados
   * @param data Dados a serem atribuidos ao token
   */
  async set(token: string, data: TokenData): Promise<number> {
    tokens[token] = data;
    return 1;
  }

  /**
   * Retorna dados de um token no servidor de autenticação
   * @param token Token para retornar os dados
   */
  get(token: string): Promise<TokenData> {
    if (!(token in tokens)) {
      return null;
    }
    return tokens[token];
  }

  /**
   * Remove um token do servidor de antenticação
   * @param token Token para remover
   */
  async remove(token: string): Promise<number> {
    if (!(token in tokens)) {
      throw Error();
    }
    delete tokens[token];
    return 1;
  }

  /**
   * Verifica se um token existe, ou seja, está logado e não expirou
   * @param token Token para verificar se existe
   */
  async exists(token: string): Promise<boolean> {
    return token in tokens;
  }
}
