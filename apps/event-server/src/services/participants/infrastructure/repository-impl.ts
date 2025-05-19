import { Injectable } from '@nestjs/common';
import { FindCondition, ParticipationRepository } from './repository';
import { Participation } from '../domain/model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { conflict, internalServerError, notFound } from '@libs/exceptions';
import { Repository } from '@libs/ddd/repository';

@Injectable()
export class ParticipationRepositoryImpl
  extends Repository
  implements ParticipationRepository
{
  constructor(
    @InjectModel(Participation.name)
    private readonly participationModel: Model<Participation>,
  ) {
    super();
  }

  async save(participations: Participation[]): Promise<void> {
    try {
      const operations = participations.map((participation) => ({
        updateOne: {
          filter: { id: participation.id },
          update: { $set: participation },
          upsert: true,
        },
      }));
      await this.participationModel.bulkWrite(operations);
    } catch (e) {
      if (e.message.includes('duplicate key error')) {
        throw conflict('Reward already exists', {
          errorMessage: '리워드가 이미 존재합니다.',
        });
      }
      throw internalServerError(`Failed to save reward: ${e.message}`, {
        errorMessage:
          '알수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      });
    }
  }

  async find(
    conditions: FindCondition,
    options?: { limit: number; page: number },
  ): Promise<Participation[]> {
    const { eventId, userId, participatedAtStart, participatedAtEnd } =
      conditions;

    const participations = this.participationModel.find({
      ...this.strip({
        eventId,
        userId,
        participatedAt: this.range(participatedAtStart, participatedAtEnd),
      }),
    });

    if (options) {
      const { limit, page } = options;
      participations.skip((page - 1) * limit).limit(limit);
    }

    return (await participations.exec()).map(
      (participation) => new Participation(participation),
    );
  }

  async count(conditions: FindCondition): Promise<number> {
    const { eventId, userId, participatedAtStart, participatedAtEnd } =
      conditions;

    return this.participationModel
      .countDocuments({
        ...this.strip({
          eventId,
          userId,
          participatedAt: this.range(participatedAtStart, participatedAtEnd),
        }),
      })
      .exec();
  }

  async findOneOrFail(id: Participation['id']): Promise<Participation> {
    const participation = await this.participationModel.findOne({ id });
    if (!participation) {
      throw notFound('Participation not found', {
        errorMessage: '리워드를 찾을 수 없습니다.',
      });
    }
    return new Participation(participation);
  }
}
