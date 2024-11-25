package kafka

import (
	"github.com/IBM/sarama"
)

func NewConsumer(addrs []string) sarama.Consumer {
	kafkaConsumer, err := sarama.NewConsumer(addrs, nil)
	if err != nil {
		panic(err)
	}
	return kafkaConsumer
}
