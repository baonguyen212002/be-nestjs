import type { File } from 'multer';

declare global {
  namespace Express {
    namespace Multer {
      export { File };
    }
  }
}
