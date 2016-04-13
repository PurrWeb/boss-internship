class FruitOrder < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordQueries

  belongs_to :venue

  validates :venue, presence: true

  validates :limes, presence: true
  validates :lemons, presence: true
  validates :rasberries, presence: true
  validates :blueberries, presence: true
  validates :blackberries, presence: true
  validates :green_apples, presence: true
  validates :oranges, presence: true
  validates :passion_fruits, presence: true
  validates :lychees, presence: true
  validates :cucumbers, presence: true
  validates :kumkwats, presence: true
  validates :dragon_fruits, presence: true
  validates :watermelon, presence: true
  validates :pink_grapefruit, presence: true
  validates :plums, presence: true
  validates :deskinned_coconuts, presence: true
  validates :fresh_mint, presence: true
  validates :fresh_basil, presence: true
  validates :fresh_lavender, presence: true
  validates :rosemary, presence: true
  validates :thyme, presence: true
  validates :red_roses, presence: true
  validates :kaffir_lime_leaves, presence: true
  validates :fresh_ginger, presence: true
  validates :bananas, presence: true
  validates :maraschino_cherry, presence: true
  validates :cream, presence: true
  validates :sharon_fruits, presence: true
  validates :figs, presence: true
  validates :blood_oranges, presence: true
  validates :pomegranates, presence: true
  validates :pineapples, presence: true

  has_many :fruit_order_transitions, autosave: false

  def self.build_default(venue:)
    new(
      venue: venue,
      limes: 0,
      lemons: 0,
      rasberries: 0,
      blueberries: 0,
      blackberries: 0,
      green_apples: 0,
      oranges: 0,
      passion_fruits: 0,
      lychees: 0,
      cucumbers: 0,
      kumkwats: 0,
      dragon_fruits: 0,
      watermelon: 0,
      pink_grapefruit: 0,
      plums: 0,
      deskinned_coconuts: 0,
      fresh_mint: 0,
      fresh_basil: 0,
      fresh_lavender: 0,
      rosemary: 0,
      thyme: 0,
      red_roses: 0,
      kaffir_lime_leaves: 0,
      fresh_ginger: 0,
      bananas: 0,
      maraschino_cherry: 0,
      cream: 0,
      sharon_fruits: 0,
      figs: 0,
      blood_oranges: 0,
      pomegranates: 0,
      pineapples: 0
    )
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
      pineapples: 'Pineapples (Each)'
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
