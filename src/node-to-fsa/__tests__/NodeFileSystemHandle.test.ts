import { DirectoryJSON, memfs } from 'memfs';
import { NodeFileSystemDirectoryHandle } from '../NodeFileSystemDirectoryHandle';
import { onlyOnNode20 } from '../../__tests__/util';

const setup = (json: DirectoryJSON = {}) => {
  const { fs } = memfs(json, '/');
  const dir = new NodeFileSystemDirectoryHandle(fs as any, '/', { mode: 'readwrite' });
  return { dir, fs };
};

onlyOnNode20('NodeFileSystemHandle', () => {
  test('can instantiate', () => {
    const { dir } = setup();
    expect(dir).toBeInstanceOf(NodeFileSystemDirectoryHandle);
  });

  describe('.isSameEntry()', () => {
    test('returns true for the same root entry', async () => {
      const { dir } = setup();
      expect(dir.isSameEntry(dir)).toBe(true);
    });

    test('returns true for two different instances of the same entry', async () => {
      const { dir } = setup({
        subdir: null,
      });
      const subdir = await dir.getDirectoryHandle('subdir');
      expect(subdir.isSameEntry(subdir)).toBe(true);
      expect(dir.isSameEntry(dir)).toBe(true);
      expect(dir.isSameEntry(subdir)).toBe(false);
      expect(subdir.isSameEntry(dir)).toBe(false);
    });

    test('returns false when comparing file with a directory', async () => {
      const { dir } = setup({
        file: 'lala',
      });
      const file = await dir.getFileHandle('file');
      expect(file.isSameEntry(dir)).toBe(false);
      expect(dir.isSameEntry(file)).toBe(false);
    });
  });
});
