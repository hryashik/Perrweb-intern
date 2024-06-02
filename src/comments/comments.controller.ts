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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Comments")
@UseGuards(JwtAuthGuard)
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: "Create comment" })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @HttpCode(201)
  @Post("/")
  createComment(@Body() dto: CreateCommentDto, @GetUser() user: any) {
    return this.commentsService.createComment({ ...dto, user_id: user.id });
  }

  @ApiOperation({ summary: "Get comments" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get("/")
  getComments(@GetUser() user: any) {
    return this.commentsService.getAllCommentsByUserId(user.id);
  }

  @ApiOperation({ summary: "Get comment by id" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Not found" })
  @ApiParam({ name: "commentId", type: Number, example: 1 })
  @Get(":commentId")
  getComment(@Param("commentId", ParseIntPipe) commentId: number) {
    return this.commentsService.getCommentById(commentId);
  }

  @ApiOperation({ summary: "Delete comment" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Permission denied" })
  @ApiResponse({ status: 404, description: "Not found" })
  @ApiParam({ name: "commentId", type: Number, example: 1 })
  @UseGuards(PermissionsGuard)
  @CustomMetadata("commentId")
  @Delete(":commentId")
  async deleteComment(@Param("commentId", ParseIntPipe) commentId: number) {
    const comment = await this.commentsService.getCommentById(commentId);
    if (!comment) throw new NotFoundException();
    return this.commentsService.deleteCommentById(commentId);
  }
}
