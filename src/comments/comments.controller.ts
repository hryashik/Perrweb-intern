import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwtAuthGuard";
import { CreateCommentDto } from "./dto/createComment.dto";
import { GetUser } from "../decorators/getUser.decorator";
import { CommentsService } from "./comments.service";

@UseGuards(JwtAuthGuard)
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @HttpCode(201)
  @Post("/")
  createComment(@Body() dto: CreateCommentDto, @GetUser() user: any) {
    return this.commentsService.createComment({ ...dto, user_id: user.id });
  }
}
