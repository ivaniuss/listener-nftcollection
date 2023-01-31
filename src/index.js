
import { Network, Alchemy, Utils } from "alchemy-sdk";
import { WebhookClient } from 'discord.js';
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
    network: Network.ETH_MAINNET
};

const alchemy = new Alchemy(settings);

const nftContractAddress = "0x21b2fB6E88081b8D250A22Af2acA797457f09C71";

const buyWithWalletEvent = {
    address: nftContractAddress,
    topics: ["0x7534e9c9396820aad756ba27f82162930f80bef863aabdf311e7dce26a79bccd"],
};

const walletTxn = async (txn) => {
    const tx = await alchemy.core.getTransactionReceipt(txn.transactionHash)
    if (tx.status === 1)
        webhookClient.send({
            content: `${txn.transactionHash}. ${tx.logs.length - 1} NFTs with ${Utils.formatUnits(parseInt(tx.gasUsed._hex).toString(), 9)} ether net fee`,
            username: 'ivaniuss',
            avatarURL: "https://d3c9os9v862gny.cloudfront.net/dXJsPWh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9kU1h0Tk90UmNNc2MxZlp1WE5qRHNmc3NFVVp5U0M0LVFOUGxQZnBTU3UtdUtZWTdiS2xmSjQyamtPLWswNnFBSFRMbnJrU1NVbzFQYTF3d1ZFOXFoMVV3c0RZTUYwejh4cnBIaVE=",
        });
}

alchemy.ws.on(buyWithWalletEvent, walletTxn);


