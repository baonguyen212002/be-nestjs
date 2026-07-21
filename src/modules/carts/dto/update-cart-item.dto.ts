import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  // Set the absolute quantity for a line. Use DELETE to remove a line entirely.
  @IsInt()
  @Min(1)
  quantity!: number;
}
