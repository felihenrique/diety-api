import * as redis from "redis";

export interface TokenData {
  userId: number;
  expiresAt: number;
  roles: string[];
}

export default class TokenService {
  private client = null;
  constructor() {
    this.client = redis.createClient();
    this.client.on("error", function(err) {
      console.log(err);
    });
  }
  /**
   * Atribui dados a um token no servidor de autenticação
   * @param token Token para atribuir os dados
   * @param data Dados a serem atribuidos ao token
   */
  set(token: string, data: TokenData): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.hset("tokens", token, JSON.stringify(data), (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }

  /**
   * Retorna dados de um token no servidor de autenticação
   * @param token Token para retornar os dados
   */
  get(token: string): Promise<TokenData> {
    return new Promise((resolve, reject) => {
      this.client.hget("tokens", token, (err, reply) => {
        if (err) reject(err);
        resolve(JSON.parse(reply));
      });
    });
  }

  /**
   * Remove um token do servidor de antenticação
   * @param token Token para remover
   */
  remove(token: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.hdel("tokens", token, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }

  /**
   * Verifica se um token existe, ou seja, está logado e não expirou
   * @param token Token para verificar se existe
   */
  exists(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.hexists("tokens", token, (err, reply) => {
        if (err) reject(err);
        resolve(reply === 1);
      });
    });
  }
}
