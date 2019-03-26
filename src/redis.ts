import * as redis from "redis";
import { promisify } from "util";

export const client = redis.createClient();
export const hset = promisify(client.hset).bind(client);
export const hget = promisify(client.hget).bind(client);
export const hgetall = promisify(client.hgetall).bind(client);

client.on("error", function(err) {
  console.log(err);
});
