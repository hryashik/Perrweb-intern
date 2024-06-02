import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwtAuthGuard";
import { CreateCommentDto } from "./dto/createComment.dto";
import { GetUser } from "../decorators/getUser.decorator";
import { CommentsService } from "./comments.service";
import { PermissionsGuard } from "../guards/permissionsGuard";
import { CustomMetadata } from "../decorators/customMetadata.decorator";

@UseGuards(JwtAuthGuard)
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @HttpCode(201)
  @Post("/")
  createComment(@Body() dto: CreateCommentDto, @GetUser() user: any) {
    return this.commentsService.createComment({ ...dto, user_id: user.id });
  }

  @Get("/")
  getComments(@GetUser() user: any) {
    return this.commentsService.getAllCommentsByUserId(user.id);
  }

  @Get(":commentId")
  getComment(@Param("commentId", ParseIntPipe) commentId: number) {
    return this.commentsService.getCommentById(commentId);
  }

  @UseGuards(PermissionsGuard)
  @CustomMetadata("commentId")
  @Delete(":commentId")
  async deleteComment(@Param("commentId", ParseIntPipe) commentId: number) {
    const comment = await this.commentsService.getCommentById(commentId);
    if (!comment) throw new NotFoundException();
    return this.commentsService.deleteCommentById(commentId);
  }
}
