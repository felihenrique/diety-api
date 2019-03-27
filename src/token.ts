import * as redis from "redis";
import { promisify } from "util";

const client = redis.createClient();

client.on("error", function(err) {
  console.log(err);
});

interface TokenData {
    userId: number;
    expiresAt: number;
}

/**
 * Atribui dados a um token no servidor de autenticação
 * @param token Token para atribuir os dados
 * @param data Dados a serem atribuidos ao token
 */
export function setTokenData(token: string, data: TokenData) : Promise<number> {
    return new Promise((resolve, reject) => {
        client.hset("tokens", token, JSON.stringify(data), (err, reply) => {
            if(err) reject(err);
            resolve(reply);
        });
    })
}

/**
 * Retorna dados de um token no servidor de autenticação
 * @param token Token para retornar os dados
 */
export function getTokenData(token: string) : Promise<TokenData> {
    return new Promise((resolve, reject) => {
        client.hget("tokens", token, (err, reply) => {
            if(err) reject(err);
            resolve(JSON.parse(reply));
        });
    });
}

/**
 * Remove um token do servidor de antenticação
 * @param token Token para remover
 */
export function removeToken(token: string) : Promise<number> {
    return new Promise((resolve, reject) => {
        client.hset("tokens", token, null, (err, reply) => {
            if(err) reject(err);
            resolve(reply);
        });
    });
}

/**
 * Verifica se um token existe, ou seja, está logado e não expirou
 * @param token Token para verificar se existe
 */
export function tokenExists(token: string) : Promise<boolean> {
    return new Promise((resolve, reject) => {
        client.hexists("tokens", token, (err, reply) => {
            if(err) reject(err);
            resolve(reply === 1);
        });
    });
}