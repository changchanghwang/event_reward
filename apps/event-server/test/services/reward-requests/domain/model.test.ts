import { RewardRequestStatus } from '@services/reward-requests/domain/model';
import { rewardRequestOf } from '@test';

describe('RewardRequest test', () => {
  describe('Approve test', () => {
    test('RewardRequest의 상태를 Approve로 변경한다', () => {
      const rewardRequest = rewardRequestOf({
        status: RewardRequestStatus.REQUESTED,
      });

      rewardRequest.approve();

      expect(rewardRequest.status).toBe(RewardRequestStatus.APPROVED);
    });

    test.each(
      Object.values(RewardRequestStatus).filter(
        (status) => status !== RewardRequestStatus.REQUESTED,
      ),
    )(
      'RewardRequest가 REQUESTED 상태가 아니면 예외를 던진다 - status: %s',
      (status) => {
        const rewardRequest = rewardRequestOf({
          status,
        });

        expect.assertions(2);
        try {
          rewardRequest.approve();
        } catch (e) {
          expect(e.message).toBe(
            'Can not approve Reward request(test-id). It is not requested',
          );
          expect(e.getResponse().errorMessage).toBe(
            '이미 완료된 리워드 요청을 승인할 수 없습니다.',
          );
        }
      },
    );
  });

  describe('Reject test', () => {
    test('RewardRequest의 상태를 REJECTED로 변경한다', () => {
      const rewardRequest = rewardRequestOf({
        status: RewardRequestStatus.REQUESTED,
      });

      rewardRequest.reject();

      expect(rewardRequest.status).toBe(RewardRequestStatus.REJECTED);
    });

    test.each(
      Object.values(RewardRequestStatus).filter(
        (status) => status !== RewardRequestStatus.REQUESTED,
      ),
    )(
      'RewardRequest가 REQUESTED 상태가 아니면 예외를 던진다 - status: %s',
      (status) => {
        const rewardRequest = rewardRequestOf({
          status,
        });

        expect.assertions(2);
        try {
          rewardRequest.reject();
        } catch (e) {
          expect(e.message).toBe(
            'Can not reject Reward request(test-id). It is not requested',
          );
          expect(e.getResponse().errorMessage).toBe(
            '이미 완료된 리워드 요청을 거절할 수 없습니다.',
          );
        }
      },
    );
  });
});
