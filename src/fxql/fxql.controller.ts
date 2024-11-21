import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FxqlService } from './fxql.service';

@Controller('fxql')
export class FxqlController {
    constructor(private readonly fxqlService: FxqlService) {}
     @Get()//fxql
    findAll() {
         const data = this.fxqlService.findAll()
         return data
    }

    @Post()//fxql
    async create(@Body() fxql: { FXQL: string }) {
        try {
        const data = await this.fxqlService.create(fxql?.FXQL)
        // console.log('data.response!!!', data)
        if (data.code == "FXQL-400") {
            // console.log('data.response', data.response.status)
            return data
        }
        // if (data.response.status == 201) {
        //     // console.log('data.response', data.response.status)
        //     return {
        //         status: "FXQL-" + data.response.status,
        //         message: data.response.error,
        //         data: data.response.data
        //     }
        // }
        return data
              
        } catch (error) {
            console.log('error', error.message)
            return {status: "FXQL-400",message:error.message}

        }
      
    }

    @Patch()//fxql
    update(@Param("id") id: string, @Body() fxql:{}) {
        return fxql
    }

    @Delete()//fxql
    delete(@Param("id") id: string) {
        return id
    }
}
