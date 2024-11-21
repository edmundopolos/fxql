import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'express';
import { CreateDateColumn, Repository } from 'typeorm';
import { BulkForexData, Forex, ParsedData } from './fxql.entity';
import { camelCase } from 'lodash';
import { Observable } from 'rxjs';

@Injectable()
export class FxqlService {
    constructor(
        @InjectRepository(Forex)
        private readonly ForexDataRepository: Repository<Forex>,
         
    ) { }
    private parseData(fxql: string): { pair: string; data: {}; status: string; message: string; }[] {
        const blockPattern = /([A-Z]{3}-[A-Z]{3})\s*{([\s\S]*?)}/g; // Matches each FXQL block
        const actionsPattern = /(\w+)\s+(\d+)/g; // Matches action-value pairs
        const results = [];
        let blockMatch;

        while ((blockMatch = blockPattern.exec(fxql)) !== null) {
            const pair = blockMatch[1].trim();
            const actionsBlock = blockMatch[2];
            const actions: Record<string, number> = {};
            let actionMatch;

            while ((actionMatch = actionsPattern.exec(actionsBlock)) !== null) {
                const [_, action, value] = actionMatch;
                const numericValue = Number(value);

                // Validate the value
                if (isNaN(numericValue) || numericValue < 0) {
                    throw new Error(`Invalid value for ${action} in pair ${pair}: ${value}. Must be a non-negative number.`);
                }

                actions[action] = numericValue;
            }

            // Validate required keys
            if (!('BUY' in actions)) {
                // return {status: "FXQL-400",message:`BUY must be positive and a number.`}
                throw new Error(`BUY must be positive and a number.`);
            }

            if (!('SELL' in actions)) {
                // return {status: "FXQL-400",message:`SELL must be positive and a number.`}
                throw new Error(`SELL must be positive and a number.`);
            }
            if (!('CAP' in actions)) {
                // return {status: "FXQL-400",message:`CAP must be positive and a number.`}
                throw new Error(`CAP must be positive and a number.`);
            }
            let pairSplit = pair.split("-")
            let SourceCurrency = pairSplit[0]
            let DestinationDurrency = pairSplit[1]
            results.push({ pair, data: {
                SourceCurrency,
                DestinationDurrency,
                "SellPrice": actions["SELL"],
                "BuyPrice": actions["BUY"],
                "CapAmount": actions["CAP"],
                // EntryId: eLength + i,
                
        } });
        }

        return results;
    }


    async upsertFxqlData(fxql:string){
    const parsedData = this.parseData(fxql);
        const process = []
        const saved = []
        for (const { pair, data } of parsedData) {
            // let pairSplit = pair.split("-")
            // let SourceCurrency = pairSplit[0]
            // let DestinationDurrency = pairSplit[1]
        process.push({...data,})
            // let data = sortData
      const add = await this.ForexDataRepository
        .createQueryBuilder()
        .insert()
        .into(Forex)
        .values({ pair, data, updatedat: new Date() })
        .orUpdate(['data'],['pair'])
        // .setParameter('data', data)
                .execute();
            saved.push({EntryId:add.raw[0].entryid,...data})
        }
        console.log('add', saved)
        
        return saved
  }
    
    async findAll(){
      const entries = await this.ForexDataRepository.find();
    const savedData = []
    for (let j = 0; j < entries.length; j++) {   
            savedData.push({
                ...entries[j].data,
                EntryId: entries[j].entryid
                
                })
            }
        

    return {
        status: HttpStatus.OK,
        message: "FXQL Statement Parsed Successfully.",
        data: savedData,
        error: ""
    };
  }

async create(fxql: string){
    // try {

    
    const findEntry = await this.ForexDataRepository.find();
    // const eLength = findEntry.data.length
    // const data = findEntry.data
        const process = []
   
    
    const save = await this.upsertFxqlData(fxql)
    return {
        code:"FXQL-"+ HttpStatus.OK,
        message: "FXQL Statement Parsed Successfully.",
        data: save,

        }
   
    // Pretty print the JSON
        
    // } catch (error) {
    //     return error
    // }
    // Match each block
    
}




}
