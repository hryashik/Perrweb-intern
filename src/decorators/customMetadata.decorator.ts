import { SetMetadata } from "@nestjs/common";

export const CustomMetadata = (data: string) => SetMetadata("paramName", data);
