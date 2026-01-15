import { Topic } from '../constants/topic.constant';

export interface TopicConfig {
  name: string;
  numPartitions: number;
  replicationFactor: number;
}

// Topic별 설정 정의
// 새 topic 추가 시 여기에 설정 추가하면 배포 시 자동 생성됨
export const TopicConfigs: TopicConfig[] = [
  {
    name: Topic.USER_LLM_MESSAGE_CREATED,
    numPartitions: 3,
    replicationFactor: 3,
  },
  {
    name: Topic.LLM_ANSWER_MESSAGE_COMPLETED,
    numPartitions: 3,
    replicationFactor: 3,
  },
  {
    name: Topic.LLM_ANSWER_FAILED,
    numPartitions: 3,
    replicationFactor: 3,
  },
];
