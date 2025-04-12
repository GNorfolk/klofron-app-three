export class CreateActionDto {
  action_id: number
  action_type_id: number
  action_queue_id: number
  action_experience_multiplier: number
  action_started_at: Date
  action_add_to_queue: number
  action_completed_at?: Date
}
