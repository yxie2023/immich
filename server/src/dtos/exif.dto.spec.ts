import { ExifResponseSchema, mapExif } from 'src/dtos/exif.dto';
import { AssetExifFactory } from 'test/factories/asset-exif.factory';

describe('ExifResponseSchema', () => {
  it('includes source FPS', () => {
    expect(ExifResponseSchema.parse({}).fps).toBeNull();
    expect(mapExif(AssetExifFactory.create({ fps: 29.97 })).fps).toBe(29.97);
  });
});
