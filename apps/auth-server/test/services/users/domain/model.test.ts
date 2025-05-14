import { v7 } from 'uuid';
import { PasswordHashService } from '@services/users/domain/services';
import { User } from '@services/users/domain/model';

jest.mock('@services/users/domain/services');
jest.mock('uuid');

describe('User model test', () => {
  const passwordHashService = jest.mocked(new PasswordHashService());

  describe('from', () => {
    beforeEach(() => {
      const mockedUuid = v7 as jest.Mock<string>;
      mockedUuid.mockReturnValue('test-id');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('새로운 유저를 생성한다.', async () => {
      passwordHashService.hash.mockResolvedValue('test-hashed-password');

      const user = await User.from({
        username: 'test-username',
        email: 'test-email',
        password: 'test-password',
        passwordHashService,
      });

      expect(user).toEqual({
        id: 'test-id',
        username: 'test-username',
        email: 'test-email',
        password: 'test-hashed-password',
        role: 'USER',
      });
    });
  });
});
