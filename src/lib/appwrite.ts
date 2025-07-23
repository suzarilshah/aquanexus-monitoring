import { Client, Account, ID } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('aquanexus-project');

const account = new Account(client);

export { client, account, ID };
export default client;