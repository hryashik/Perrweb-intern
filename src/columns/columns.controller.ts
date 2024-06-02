import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwtAuthGuard";
import { CreateColumnDto } from "./dto/createColumn.dto";
import { ColumnsService } from "./columns.service";
import { GetUser } from "../decorators/getUser.decorator";

@UseGuards(JwtAuthGuard)
@Controller("columns")
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post("/")
  createColumn(@Body() dto: CreateColumnDto, @GetUser() user: any) {
    if (!user.id) throw new UnauthorizedException();
    return this.columnsService.createColumn(dto, user.id);
  }

  @Get(":columnId")
  getColumnById(@Param("columnId", ParseIntPipe) columnId: number) {
    return this.columnsService.getColumnById(columnId);
  }
}
