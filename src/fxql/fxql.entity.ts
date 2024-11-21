import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Forex {
 @PrimaryGeneratedColumn()
  entryid: number;


  @Column({ type: 'jsonb' })
  data: Record<string,any>;

  @Column({ type: 'varchar', length: 7, unique: true })
  pair?: string | null;

 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedat: Date;
    
  //      @CreateDateColumn({ type: "timestamp without time zone", default: () => "CURRENT_TIMESTAMP" })
  // createdat?: number;
}


export class ParsedData {
  pair: string;
  actions: {
    SELL: string;
    BUY: string;
    CAP: string;
  };
}



export class BulkForexData {

  data: [Forex];
    
  status?: number;

  message: string;

error: string

}