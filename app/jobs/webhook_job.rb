# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Job for enqueuing updates about records to webhooks
class WebhookJob < ApplicationJob
  queue_as :api

  def perform(record_type, record_id, action)
    record = PrimeroModelService.to_model(record_type)&.find_by(id: record_id)
    return unless record&.webhook_configured?

    webhooks = Webhook.webhooks_for(record, action)
    webhooks.each { |webhook| webhook.post(record) }
  rescue StandardError => e
    Rails.logger.error("Error sending out #{record_type} #{record_id}. Error: #{e.message}")
  end
end
