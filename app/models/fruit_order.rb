class FruitOrder < ActiveRecord::Base
  FIELDS = [
    :limes,
    :lemons,
    :eggs,
    :rasberries,
    :blueberries,
    :blackberries,
    :green_apples,
    :oranges,
    :passion_fruits,
    :lychees,
    :cucumbers,
    :kumkwats,
    :dragon_fruits,
    :watermelon,
    :pink_grapefruit,
    :plums,
    :deskinned_coconuts,
    :fresh_mint,
    :fresh_basil,
    :fresh_lavender,
    :rosemary,
    :thyme,
    :red_roses,
    :kaffir_lime_leaves,
    :fresh_ginger,
    :bananas,
    :maraschino_cherry,
    :cream,
    :sharon_fruits,
    :figs,
    :blood_oranges,
    :pomegranates,
    :pineapples,
    :strawberries,
    :cranberries,
    :kiwi_fruits,
    :vanilla_pods,
    :edible_flowers,
    :red_grapes,
    :green_grapes
  ]

  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :venue

  validates :venue, presence: true

  FIELDS.each do |field|
    validates field, presence: true
  end
  has_many :fruit_order_transitions, autosave: false

  def self.build_default(venue:)
    field_values = {}
    FIELDS.each do |field|
      field_values[field] = 0
    end

    new(field_values.merge(venue: venue))
  end

  def form_fruit_order_fields
    if venue.fruit_order_fields.count == 0
      FruitOrder::FIELDS
    else
      (venue.fruit_order_fields + fields_with_value).uniq
    end
  end

  def fields_with_value
    FruitOrder::FIELDS.select do |field|
      public_send(field).to_i > 0
    end
  end

  def self.current
    in_state(:in_progress)
  end

  def self.enabled
    not_in_state(:deleted)
  end

  def self.current
    in_state(:in_progress)
  end

  def self.accepted
    in_state(:accepted)
  end

  def self.done
    in_state(:done)
  end

  def state_machine
    @state_machine ||= FruitOrderStateMachine.new(
      self,
      transition_class: FruitOrderTransition,
      association_name: :fruit_order_transitions
    )
  end

  def self.message_for(property)
    {
      limes: 'Limes (Box)',
      eggs:  'Eggs (Dozen)',
      lemons: 'Lemons (Box)',
      rasberries: 'Rasberries (Punnet)',
      blueberries: 'Blueberries (Punnet)',
      blackberries: 'Blackberrires (Punnet)',
      green_apples: 'Green Apples (Each)',
      oranges: 'Oranges (Each)',
      passion_fruits: 'Passion Fruits (Box)',
      lychees: 'Lychees (Box)',
      cucumbers: 'Cucumber (Each)',
      kumkwats: 'Kumkwats (Each)',
      dragon_fruits: 'Dragon Fruits (Each)',
      watermelon: 'Watermelons (Each)',
      pink_grapefruit: 'Pink Grapefruits (Each)',
      plums: 'Plums (Box)',
      deskinned_coconuts: 'Deskinned Coconuts (Each)',
      fresh_mint: 'Fresh Mint (Bunch)',
      fresh_basil: 'Fresh Basil (Bunch)',
      fresh_lavender: 'Fresh Lavender (Bunch)',
      rosemary: 'Rosemary (Bunch)',
      thyme: 'Thyme (Bunch)',
      red_roses: 'Read Roses (Bunch)',
      kaffir_lime_leaves: 'Kaffir Lime Leaves - Frozen (Bag) ',
      fresh_ginger: 'Fresh Ginger (Each)',
      bananas: 'Banana (Each)',
      maraschino_cherry: 'Maraschino Cherry (Tub)',
      cream: 'Cream (1 Ltr Carton)',
      sharon_fruits: 'Sharon Fruits (Box)',
      figs: 'Figs (Punnet)',
      blood_oranges: 'Blood Oranges (Each)',
      pomegranates: 'Pomegranates (Each)',
      pineapples: 'Pineapples (Each)',
      strawberries: 'Strawberries (Punnet)',
      cranberries: 'Cranberries (Punnet)',
      kiwi_fruits: 'Kiwi Fruits (Each)',
      vanilla_pods: 'Vanilla Pods (10x Pods)',
      edible_flowers: 'Edible Flowers (30g Tub)',
      red_grapes: 'Red Grapes (Punnet)',
      green_grapes: 'Green Grapes (Punnet)'
    }.fetch(property)
  end

  def current_state
    state_machine.current_state
  end

  def deleted?
    current_state == 'deleted'
  end

  def in_progress?
    current_state == "in_progress"
  end

  def accepted?
    ["accepted", "done"].include?(current_state)
  end

  def accepted_at
    accepted_transition.created_at
  end

  def accepted_user
    accepted? && User.find(accepted_transition.metadata.fetch("requster_user_id"))
  end

  def done?
    current_state == "done"
  end

  def done_at
    done? && fruit_order_transitions.last.created_at
  end

  def done_user
    done? && User.find(fruit_order_transitions.last.metadata.fetch("requster_user_id"))
  end

  private
  def accepted_transition
    fruit_order_transitions.
    where(to_state: 'accepted').
    last
  end

  # Needed for statesman
  def self.transition_class
    FruitOrderTransition
  end

  def self.initial_state
    FruitOrderStateMachine.initial_state
  end
end
