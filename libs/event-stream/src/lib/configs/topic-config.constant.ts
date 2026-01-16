import { Topic } from '../constants/topic.constant';

// KafkaJS의 설정 엔트리 타입 정의
export interface ConfigEntry {
  name: string;
  value: string;
}

// KafkaJS ITopicConfig 인터페이스와 호환되도록 구조 개선
export interface TopicConfig {
  topic: string; // KafkaJS 표준 필드명은 'topic'입니다 (기존 name에서 변경 권장)
  numPartitions: number;
  replicationFactor: number;
  configEntries?: ConfigEntry[]; // 고급 설정을 위한 필드 추가
}

// 공통 설정 (딥리서치용 안전 설정)
const DEEP_RESEARCH_TOPIC_CONFIG: ConfigEntry[] = [
  { name: 'min.insync.replicas', value: '2' }, // 최소 2개 브로커 저장 보장 (데이터 유실 방지)
  { name: 'retention.ms', value: '86400000' }, // 1일 보관 (BullMQ로 넘어가면 필요 없으므로 디스크 절약)
  { name: 'max.message.bytes', value: '10485760' }, // 10MB (긴 프롬프트 및 컨텍스트 허용)
];

export const TopicConfigs: TopicConfig[] = [
  {
    topic: Topic.USER_LLM_MESSAGE_CREATED,
    numPartitions: 3,
    replicationFactor: 3,
    configEntries: DEEP_RESEARCH_TOPIC_CONFIG,
  },
  {
    topic: Topic.LLM_ANSWER_MESSAGE_COMPLETED,
    numPartitions: 3,
    replicationFactor: 3,
    configEntries: DEEP_RESEARCH_TOPIC_CONFIG,
  },
  {
    topic: Topic.LLM_ANSWER_FAILED,
    numPartitions: 3,
    replicationFactor: 3,
    configEntries: [
      { name: 'min.insync.replicas', value: '2' },
      { name: 'retention.ms', value: '604800000' }, // 에러 로그는 디버깅을 위해 7일(기본값) 유지 권장
    ],
  },
];
