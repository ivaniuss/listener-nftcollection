
// npm install @alchemy-sdk
import { Network, Alchemy, Utils } from "alchemy-sdk";
import { WebhookClient } from 'discord.js';
// import { webhookId, webhookToken } from './config.json';
import * as dotenv from 'dotenv';
dotenv.config();


const webhookClient = new WebhookClient(
    {
        id: process.env.ID,
        token: process.env.TOKEN
    }
);

const settings = {
    apiKey: process.env.API_KEY,
    network: Network.ETH_GOERLI
};

const alchemy = new Alchemy(settings);

const nftContractAddress = "0x96BEfFc337281C439BE26AA272c16A7D3a4836B5";

const hackrDaoMintEvents = {
    address: nftContractAddress,
    topics: ["0x66fce252103f2018c6e48a00714ea63977ba2985af37d39e9d98ff17fef6986b"],
};

const doSomethingWithTxn = async (txn) => {
    const tx = await alchemy.core.getTransactionReceipt(txn.transactionHash)
    console.log('tx', tx)
    if (tx.status === 1)
        webhookClient.send({
            content: `${txn.transactionHash}. ${tx.logs.length - 1} NFTs with ${Utils.formatUnits(parseInt(tx.gasUsed._hex).toString(), 9)} ether net fee`,
            username: 'ivaniuss',
            avatarURL: "https://d3c9os9v862gny.cloudfront.net/dXJsPWh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9kU1h0Tk90UmNNc2MxZlp1WE5qRHNmc3NFVVp5U0M0LVFOUGxQZnBTU3UtdUtZWTdiS2xmSjQyamtPLWswNnFBSFRMbnJrU1NVbzFQYTF3d1ZFOXFoMVV3c0RZTUYwejh4cnBIaVE=",
        });
}

alchemy.ws.on(hackrDaoMintEvents, doSomethingWithTxn);


