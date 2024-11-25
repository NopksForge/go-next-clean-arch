package user

import (
	"context"
	"user-management/app"
	"user-management/logger"

	"github.com/IBM/sarama"
)

type storageKafka struct {
	producer sarama.SyncProducer
}

func NewStorageKafka(producer sarama.SyncProducer) *storageKafka {
	return &storageKafka{producer: producer}
}

func (s *storageKafka) ProduceUserCreation(ctx context.Context, data []byte) error {
	logger := logger.New()

	msg := &sarama.ProducerMessage{Topic: string(app.KafkaTopicUserCreation), Value: sarama.ByteEncoder(data)}
	partition, offset, err := s.producer.SendMessage(msg)
	if err != nil {
		logger.Error("failed to send message", "error", err)
		return err
	}

	logger.Info("message sent", "partition", partition, "offset", offset)
	return nil
}
