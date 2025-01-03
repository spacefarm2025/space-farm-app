class XpEarn:
    def __init__(self):
        self.seed = 15
        self.watering = 5
        self.harvest = 30
        self.level = 100

    def xp_for_level(self, level):
        return int((level * (level - 1) // 2) * self.level * 2)

    def xp_for_action(self, action: int, plant_id):
        if action == 1:
            boost = self.seed
        elif action == 2:
            boost = self.watering
        elif action == 3:
            boost = self.harvest
        else:
            boost = 0
        return int((plant_id ** 2) / 2 * boost)


xp_admin = XpEarn()
