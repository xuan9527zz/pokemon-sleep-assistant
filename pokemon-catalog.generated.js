(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_CATALOG=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  return Object.freeze({
  "meta": {
    "generatedAt": "2026-09-01T01:05:08.518Z",
    "sourceUpdatedAt": "2026-08-23T20:32:34.939Z",
    "count": 247,
    "speciesScoreCount": 127,
    "collectionProfile": "Lv.70; skill species use 4-hour collection, Good Camp, 50% extra-ingredient availability"
  },
  "pokemon": [
    {
      "id": "1",
      "pokedexId": 1,
      "name": "妙蛙种子",
      "sourceNameZh": "妙蛙種子",
      "nameEn": "Bulbasaur",
      "specialty": "ingredient",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4400,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.257,
      "skillRatePct": 1.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "1",
        "previous": null,
        "next": [
          {
            "id": "2",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "3"
      ],
      "defaultFinalId": "3",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 5,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 7,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "2",
      "pokedexId": 2,
      "name": "妙蛙草",
      "sourceNameZh": "妙蛙草",
      "nameEn": "Ivysaur",
      "specialty": "ingredient",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3300,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.255,
      "skillRatePct": 1.9,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "1",
        "previous": {
          "id": "1",
          "conditions": []
        },
        "next": [
          {
            "id": "3",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 24
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "3"
      ],
      "defaultFinalId": "3",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 5,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 7,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "3",
      "pokedexId": 3,
      "name": "妙蛙花",
      "sourceNameZh": "妙蛙花",
      "nameEn": "Venusaur",
      "specialty": "ingredient",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 27,
      "ingredientRate": 0.266,
      "skillRatePct": 2.1,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "1",
        "previous": {
          "id": "2",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "3"
      ],
      "defaultFinalId": "3",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 5,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 7,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "4",
      "pokedexId": 4,
      "name": "小火龙",
      "sourceNameZh": "小火龍",
      "nameEn": "Charmander",
      "specialty": "ingredient",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3500,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 12,
      "ingredientRate": 0.201,
      "skillRatePct": 1.1,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "4",
        "previous": null,
        "next": [
          {
            "id": "5",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "6"
      ],
      "defaultFinalId": "6",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 7,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 7,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 6,
            "code": "C",
            "quantity": 6,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "5",
      "pokedexId": 5,
      "name": "火恐龙",
      "sourceNameZh": "火恐龍",
      "nameEn": "Charmeleon",
      "specialty": "ingredient",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3000,
      "carryLimitBase": 15,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.227,
      "skillRatePct": 1.6,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "4",
        "previous": {
          "id": "4",
          "conditions": []
        },
        "next": [
          {
            "id": "6",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 27
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "6"
      ],
      "defaultFinalId": "6",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 7,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 7,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 6,
            "code": "C",
            "quantity": 6,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "6",
      "pokedexId": 6,
      "name": "喷火龙",
      "sourceNameZh": "噴火龍",
      "nameEn": "Charizard",
      "specialty": "ingredient",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 29,
      "ingredientRate": 0.224,
      "skillRatePct": 1.6,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "4",
        "previous": {
          "id": "5",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "6"
      ],
      "defaultFinalId": "6",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 7,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 7,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 6,
            "code": "C",
            "quantity": 6,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "7",
      "pokedexId": 7,
      "name": "杰尼龟",
      "sourceNameZh": "傑尼龜",
      "nameEn": "Squirtle",
      "specialty": "ingredient",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4500,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.271,
      "skillRatePct": 2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "7",
        "previous": null,
        "next": [
          {
            "id": "8",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "9"
      ],
      "defaultFinalId": "9",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 5,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 7,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 5,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 7,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "8",
      "pokedexId": 8,
      "name": "卡咪龟",
      "sourceNameZh": "卡咪龜",
      "nameEn": "Wartortle",
      "specialty": "ingredient",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3400,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.271,
      "skillRatePct": 2,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "7",
        "previous": {
          "id": "7",
          "conditions": []
        },
        "next": [
          {
            "id": "9",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 27
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "9"
      ],
      "defaultFinalId": "9",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 5,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 7,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 5,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 7,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "9",
      "pokedexId": 9,
      "name": "水箭龟",
      "sourceNameZh": "水箭龜",
      "nameEn": "Blastoise",
      "specialty": "ingredient",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 27,
      "ingredientRate": 0.275,
      "skillRatePct": 2.1,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "7",
        "previous": {
          "id": "8",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "9"
      ],
      "defaultFinalId": "9",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 5,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 7,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 5,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 7,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "10",
      "pokedexId": 10,
      "name": "绿毛虫",
      "sourceNameZh": "綠毛蟲",
      "nameEn": "Caterpie",
      "specialty": "berry",
      "typeId": 12,
      "berryId": 12,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4400,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.179,
      "skillRatePct": 0.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "10",
        "previous": null,
        "next": [
          {
            "id": "11",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 5
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "12"
      ],
      "defaultFinalId": "12",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 1,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 3,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "11",
      "pokedexId": 11,
      "name": "铁甲蛹",
      "sourceNameZh": "鐵甲蛹",
      "nameEn": "Metapod",
      "specialty": "berry",
      "typeId": 12,
      "berryId": 12,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4200,
      "carryLimitBase": 13,
      "carryLimitRaisedFromFirstStage": 18,
      "ingredientRate": 0.208,
      "skillRatePct": 1.8,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "10",
        "previous": {
          "id": "10",
          "conditions": []
        },
        "next": [
          {
            "id": "12",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 8
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "12"
      ],
      "defaultFinalId": "12",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 1,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 3,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "12",
      "pokedexId": 12,
      "name": "巴大蝶",
      "sourceNameZh": "巴大蝶",
      "nameEn": "Butterfree",
      "specialty": "berry",
      "typeId": 12,
      "berryId": 12,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 21,
      "carryLimitRaisedFromFirstStage": 31,
      "ingredientRate": 0.197,
      "skillRatePct": 1.4,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "10",
        "previous": {
          "id": "11",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "12"
      ],
      "defaultFinalId": "12",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 1,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 3,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "19",
      "pokedexId": 19,
      "name": "小拉达",
      "sourceNameZh": "小拉達",
      "nameEn": "Rattata",
      "specialty": "berry",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4900,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.237,
      "skillRatePct": 3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "19",
        "previous": null,
        "next": [
          {
            "id": "20",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 15
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "20"
      ],
      "defaultFinalId": "20",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 3,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "20",
      "pokedexId": 20,
      "name": "拉达",
      "sourceNameZh": "拉達",
      "nameEn": "Raticate",
      "specialty": "berry",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2950,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.237,
      "skillRatePct": 3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "19",
        "previous": {
          "id": "19",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "20"
      ],
      "defaultFinalId": "20",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 3,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "23",
      "pokedexId": 23,
      "name": "阿柏蛇",
      "sourceNameZh": "阿柏蛇",
      "nameEn": "Ekans",
      "specialty": "berry",
      "typeId": 8,
      "berryId": 8,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 5000,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.235,
      "skillRatePct": 3.3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "23",
        "previous": null,
        "next": [
          {
            "id": "24",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 17
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "24"
      ],
      "defaultFinalId": "24",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 6,
            "code": "C",
            "quantity": 3,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "24",
      "pokedexId": 24,
      "name": "阿柏怪",
      "sourceNameZh": "阿柏怪",
      "nameEn": "Arbok",
      "specialty": "berry",
      "typeId": 8,
      "berryId": 8,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3400,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.264,
      "skillRatePct": 5.7,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "23",
        "previous": {
          "id": "23",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "24"
      ],
      "defaultFinalId": "24",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 6,
            "code": "C",
            "quantity": 3,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "25",
      "pokedexId": 25,
      "name": "皮卡丘",
      "sourceNameZh": "皮卡丘",
      "nameEn": "Pikachu",
      "specialty": "berry",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2700,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 22,
      "ingredientRate": 0.207,
      "skillRatePct": 2.1,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "172",
        "previous": {
          "id": "172",
          "conditions": []
        },
        "next": [
          {
            "id": "26",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 24,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "26"
      ],
      "defaultFinalId": "26",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "26",
      "pokedexId": 26,
      "name": "雷丘",
      "sourceNameZh": "雷丘",
      "nameEn": "Raichu",
      "specialty": "berry",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2200,
      "carryLimitBase": 21,
      "carryLimitRaisedFromFirstStage": 31,
      "ingredientRate": 0.224,
      "skillRatePct": 3.2,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "172",
        "previous": {
          "id": "25",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "26"
      ],
      "defaultFinalId": "26",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "27",
      "pokedexId": 27,
      "name": "穿山鼠",
      "sourceNameZh": "穿山鼠",
      "nameEn": "Sandshrew",
      "specialty": "skill",
      "typeId": 9,
      "berryId": 9,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5300,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.1,
      "skillRatePct": 4.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "27",
        "previous": null,
        "next": [
          {
            "id": "28",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 17
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "28"
      ],
      "defaultFinalId": "28",
      "mainSkill": {
        "id": 28,
        "name": "食材精选S",
        "nameEn": "Ingredient Draw S"
      },
      "ingredients": {
        "1": [
          {
            "id": 18,
            "code": "A",
            "quantity": 1,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "30": [
          {
            "id": 18,
            "code": "A",
            "quantity": 2,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 4,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 18,
            "code": "A",
            "quantity": 4,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 6,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 7,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "28",
      "pokedexId": 28,
      "name": "穿山王",
      "sourceNameZh": "穿山王",
      "nameEn": "Sandslash",
      "specialty": "skill",
      "typeId": 9,
      "berryId": 9,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 22,
      "ingredientRate": 0.108,
      "skillRatePct": 4.3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "27",
        "previous": {
          "id": "27",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "28"
      ],
      "defaultFinalId": "28",
      "mainSkill": {
        "id": 28,
        "name": "食材精选S",
        "nameEn": "Ingredient Draw S"
      },
      "ingredients": {
        "1": [
          {
            "id": 18,
            "code": "A",
            "quantity": 1,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "30": [
          {
            "id": 18,
            "code": "A",
            "quantity": 2,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 4,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 18,
            "code": "A",
            "quantity": 4,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 6,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 7,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "35",
      "pokedexId": 35,
      "name": "皮皮",
      "sourceNameZh": "皮皮",
      "nameEn": "Clefairy",
      "specialty": "berry",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4000,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.168,
      "skillRatePct": 3.6,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "173",
        "previous": {
          "id": "173",
          "conditions": []
        },
        "next": [
          {
            "id": "36",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 27,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "36"
      ],
      "defaultFinalId": "36",
      "mainSkill": {
        "id": 13,
        "name": "挥指",
        "nameEn": "Metronome"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 3,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 3,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "36",
      "pokedexId": 36,
      "name": "皮可西",
      "sourceNameZh": "皮可西",
      "nameEn": "Clefable",
      "specialty": "berry",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 24,
      "carryLimitRaisedFromFirstStage": 34,
      "ingredientRate": 0.168,
      "skillRatePct": 4,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "173",
        "previous": {
          "id": "35",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "36"
      ],
      "defaultFinalId": "36",
      "mainSkill": {
        "id": 13,
        "name": "挥指",
        "nameEn": "Metronome"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 3,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 3,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "37",
      "pokedexId": 37,
      "name": "六尾",
      "sourceNameZh": "六尾",
      "nameEn": "Vulpix",
      "specialty": "berry",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4700,
      "carryLimitBase": 13,
      "carryLimitRaisedFromFirstStage": 13,
      "ingredientRate": 0.168,
      "skillRatePct": 3.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "37",
        "previous": null,
        "next": [
          {
            "id": "38",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 22,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "38"
      ],
      "defaultFinalId": "38",
      "mainSkill": {
        "id": 4,
        "name": "活力疗愈S",
        "nameEn": "Energizing Cheer S"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 1,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 3,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "38",
      "pokedexId": 38,
      "name": "九尾",
      "sourceNameZh": "九尾",
      "nameEn": "Ninetales",
      "specialty": "berry",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2600,
      "carryLimitBase": 23,
      "carryLimitRaisedFromFirstStage": 28,
      "ingredientRate": 0.164,
      "skillRatePct": 2.9,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "37",
        "previous": {
          "id": "37",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "38"
      ],
      "defaultFinalId": "38",
      "mainSkill": {
        "id": 4,
        "name": "活力疗愈S",
        "nameEn": "Energizing Cheer S"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 1,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 3,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "39",
      "pokedexId": 39,
      "name": "胖丁",
      "sourceNameZh": "胖丁",
      "nameEn": "Jigglypuff",
      "specialty": "skill",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3900,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 14,
      "ingredientRate": 0.182,
      "skillRatePct": 4.3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "174",
        "previous": {
          "id": "174",
          "conditions": []
        },
        "next": [
          {
            "id": "40",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 27,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "40"
      ],
      "defaultFinalId": "40",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 1,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 13,
            "code": "C",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ]
      }
    },
    {
      "id": "40",
      "pokedexId": 40,
      "name": "胖可丁",
      "sourceNameZh": "胖可丁",
      "nameEn": "Wigglytuff",
      "specialty": "skill",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2750,
      "carryLimitBase": 22,
      "carryLimitRaisedFromFirstStage": 32,
      "ingredientRate": 0.191,
      "skillRatePct": 4,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "174",
        "previous": {
          "id": "39",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "40"
      ],
      "defaultFinalId": "40",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 1,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 13,
            "code": "C",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ]
      }
    },
    {
      "id": "50",
      "pokedexId": 50,
      "name": "地鼠",
      "sourceNameZh": "地鼠",
      "nameEn": "Diglett",
      "specialty": "ingredient",
      "typeId": 9,
      "berryId": 9,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4300,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.192,
      "skillRatePct": 2.1,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "50",
        "previous": null,
        "next": [
          {
            "id": "51",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 20
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "51"
      ],
      "defaultFinalId": "51",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 3,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 4,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 8,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "51",
      "pokedexId": 51,
      "name": "三地鼠",
      "sourceNameZh": "三地鼠",
      "nameEn": "Dugtrio",
      "specialty": "ingredient",
      "typeId": 9,
      "berryId": 9,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2650,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.19,
      "skillRatePct": 2,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "50",
        "previous": {
          "id": "50",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "51"
      ],
      "defaultFinalId": "51",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 3,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 4,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 8,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "52",
      "pokedexId": 52,
      "name": "喵喵",
      "sourceNameZh": "喵喵",
      "nameEn": "Meowth",
      "specialty": "skill",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4400,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.163,
      "skillRatePct": 4.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "52",
        "previous": null,
        "next": [
          {
            "id": "53",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 21
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "53"
      ],
      "defaultFinalId": "53",
      "mainSkill": {
        "id": 3,
        "name": "梦之碎片获取S",
        "nameEn": "Dream Shard Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "53",
      "pokedexId": 53,
      "name": "猫老大",
      "sourceNameZh": "貓老大",
      "nameEn": "Persian",
      "specialty": "skill",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 17,
      "ingredientRate": 0.169,
      "skillRatePct": 4.4,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "52",
        "previous": {
          "id": "52",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "53"
      ],
      "defaultFinalId": "53",
      "mainSkill": {
        "id": 3,
        "name": "梦之碎片获取S",
        "nameEn": "Dream Shard Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "54",
      "pokedexId": 54,
      "name": "可达鸭",
      "sourceNameZh": "可達鴨",
      "nameEn": "Psyduck",
      "specialty": "skill",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5400,
      "carryLimitBase": 8,
      "carryLimitRaisedFromFirstStage": 8,
      "ingredientRate": 0.136,
      "skillRatePct": 12.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "54",
        "previous": null,
        "next": [
          {
            "id": "55",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 25
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "55"
      ],
      "defaultFinalId": "55",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 4,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 6,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "55",
      "pokedexId": 55,
      "name": "哥达鸭",
      "sourceNameZh": "哥達鴨",
      "nameEn": "Golduck",
      "specialty": "skill",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3400,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.162,
      "skillRatePct": 12.5,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "54",
        "previous": {
          "id": "54",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "55"
      ],
      "defaultFinalId": "55",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 4,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 6,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "56",
      "pokedexId": 56,
      "name": "猴怪",
      "sourceNameZh": "猴怪",
      "nameEn": "Mankey",
      "specialty": "berry",
      "typeId": 7,
      "berryId": 7,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4200,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 12,
      "ingredientRate": 0.197,
      "skillRatePct": 2.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "56",
        "previous": null,
        "next": [
          {
            "id": "57",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 21
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "57"
      ],
      "defaultFinalId": "57",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "57",
      "pokedexId": 57,
      "name": "火爆猴",
      "sourceNameZh": "火爆猴",
      "nameEn": "Primeape",
      "specialty": "berry",
      "typeId": 7,
      "berryId": 7,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 22,
      "ingredientRate": 0.2,
      "skillRatePct": 2.4,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "56",
        "previous": {
          "id": "56",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "57"
      ],
      "defaultFinalId": "57",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "58",
      "pokedexId": 58,
      "name": "卡蒂狗",
      "sourceNameZh": "卡蒂狗",
      "nameEn": "Growlithe",
      "specialty": "skill",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4300,
      "carryLimitBase": 8,
      "carryLimitRaisedFromFirstStage": 8,
      "ingredientRate": 0.138,
      "skillRatePct": 5,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "58",
        "previous": null,
        "next": [
          {
            "id": "59",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 22,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "59"
      ],
      "defaultFinalId": "59",
      "mainSkill": {
        "id": 9,
        "name": "帮手支援S",
        "nameEn": "Extra Helpful S"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 1,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 8,
            "code": "C",
            "quantity": 5,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ]
      }
    },
    {
      "id": "59",
      "pokedexId": 59,
      "name": "风速狗",
      "sourceNameZh": "風速狗",
      "nameEn": "Arcanine",
      "specialty": "skill",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.136,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "58",
        "previous": {
          "id": "58",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "59"
      ],
      "defaultFinalId": "59",
      "mainSkill": {
        "id": 9,
        "name": "帮手支援S",
        "nameEn": "Extra Helpful S"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 1,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 8,
            "code": "C",
            "quantity": 5,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ]
      }
    },
    {
      "id": "69",
      "pokedexId": 69,
      "name": "喇叭芽",
      "sourceNameZh": "喇叭芽",
      "nameEn": "Bellsprout",
      "specialty": "ingredient",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5200,
      "carryLimitBase": 8,
      "carryLimitRaisedFromFirstStage": 8,
      "ingredientRate": 0.233,
      "skillRatePct": 3.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "69",
        "previous": null,
        "next": [
          {
            "id": "70",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 16
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "71"
      ],
      "defaultFinalId": "71",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 4,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "70",
      "pokedexId": 70,
      "name": "口呆花",
      "sourceNameZh": "口呆花",
      "nameEn": "Weepinbell",
      "specialty": "ingredient",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3800,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 17,
      "ingredientRate": 0.235,
      "skillRatePct": 4,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "69",
        "previous": {
          "id": "69",
          "conditions": []
        },
        "next": [
          {
            "id": "71",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 25,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "71"
      ],
      "defaultFinalId": "71",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 4,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "71",
      "pokedexId": 71,
      "name": "大食花",
      "sourceNameZh": "大食花",
      "nameEn": "Victreebel",
      "specialty": "ingredient",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 27,
      "ingredientRate": 0.233,
      "skillRatePct": 3.9,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "69",
        "previous": {
          "id": "70",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "71"
      ],
      "defaultFinalId": "71",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 4,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "74",
      "pokedexId": 74,
      "name": "小拳石",
      "sourceNameZh": "小拳石",
      "nameEn": "Geodude",
      "specialty": "ingredient",
      "typeId": 13,
      "berryId": 13,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5700,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.281,
      "skillRatePct": 5.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "74",
        "previous": null,
        "next": [
          {
            "id": "75",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 19
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "76"
      ],
      "defaultFinalId": "76",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 5,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 7,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "75",
      "pokedexId": 75,
      "name": "隆隆石",
      "sourceNameZh": "隆隆石",
      "nameEn": "Graveler",
      "specialty": "ingredient",
      "typeId": 13,
      "berryId": 13,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4000,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 17,
      "ingredientRate": 0.272,
      "skillRatePct": 4.8,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "74",
        "previous": {
          "id": "74",
          "conditions": []
        },
        "next": [
          {
            "id": "76",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 21,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "76"
      ],
      "defaultFinalId": "76",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 5,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 7,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "76",
      "pokedexId": 76,
      "name": "隆隆岩",
      "sourceNameZh": "隆隆岩",
      "nameEn": "Golem",
      "specialty": "ingredient",
      "typeId": 13,
      "berryId": 13,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3100,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 26,
      "ingredientRate": 0.28,
      "skillRatePct": 5.2,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "74",
        "previous": {
          "id": "75",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "76"
      ],
      "defaultFinalId": "76",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 5,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 7,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "79",
      "pokedexId": 79,
      "name": "呆呆兽",
      "sourceNameZh": "呆呆獸",
      "nameEn": "Slowpoke",
      "specialty": "skill",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5700,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.151,
      "skillRatePct": 7.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "79",
        "previous": null,
        "next": [
          {
            "id": "80",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 28
              }
            ]
          },
          {
            "id": "199",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 31,
                "count": 1
              },
              {
                "type": "item",
                "item": 21,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "80",
        "199"
      ],
      "defaultFinalId": "80",
      "mainSkill": {
        "id": 4,
        "name": "活力疗愈S",
        "nameEn": "Energizing Cheer S"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 14,
            "code": "B",
            "quantity": 1,
            "name": "美味尾巴",
            "nameEn": "Slowpoke Tail"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 4,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 14,
            "code": "B",
            "quantity": 2,
            "name": "美味尾巴",
            "nameEn": "Slowpoke Tail"
          },
          {
            "id": 12,
            "code": "C",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ]
      }
    },
    {
      "id": "80",
      "pokedexId": 80,
      "name": "呆壳兽",
      "sourceNameZh": "呆殼獸",
      "nameEn": "Slowbro",
      "specialty": "skill",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3800,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.197,
      "skillRatePct": 8,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "79",
        "previous": {
          "id": "79",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "80"
      ],
      "defaultFinalId": "80",
      "mainSkill": {
        "id": 4,
        "name": "活力疗愈S",
        "nameEn": "Energizing Cheer S"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 14,
            "code": "B",
            "quantity": 1,
            "name": "美味尾巴",
            "nameEn": "Slowpoke Tail"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 4,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 14,
            "code": "B",
            "quantity": 2,
            "name": "美味尾巴",
            "nameEn": "Slowpoke Tail"
          },
          {
            "id": 12,
            "code": "C",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ]
      }
    },
    {
      "id": "81",
      "pokedexId": 81,
      "name": "小磁怪",
      "sourceNameZh": "小磁怪",
      "nameEn": "Magnemite",
      "specialty": "skill",
      "typeId": 17,
      "berryId": 17,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5800,
      "carryLimitBase": 8,
      "carryLimitRaisedFromFirstStage": 8,
      "ingredientRate": 0.182,
      "skillRatePct": 6.4,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "81",
        "previous": null,
        "next": [
          {
            "id": "82",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 23
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "462"
      ],
      "defaultFinalId": "462",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 3,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "82",
      "pokedexId": 82,
      "name": "三合一磁怪",
      "sourceNameZh": "三合一磁怪",
      "nameEn": "Magneton",
      "specialty": "skill",
      "typeId": 17,
      "berryId": 17,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4000,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 16,
      "ingredientRate": 0.182,
      "skillRatePct": 6.3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "81",
        "previous": {
          "id": "81",
          "conditions": []
        },
        "next": [
          {
            "id": "462",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 24,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "462"
      ],
      "defaultFinalId": "462",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 3,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "83",
      "pokedexId": 83,
      "name": "大葱鸭",
      "sourceNameZh": "大蔥鴨",
      "nameEn": "Farfetch'd",
      "specialty": "ingredient",
      "typeId": 10,
      "berryId": 10,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3000,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 18,
      "ingredientRate": 0.16,
      "skillRatePct": 4.3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "83",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "83"
      ],
      "defaultFinalId": "83",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 1,
            "code": "A",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "30": [
          {
            "id": 1,
            "code": "A",
            "quantity": 5,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 8,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 1,
            "code": "A",
            "quantity": 7,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 13,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 11,
            "code": "C",
            "quantity": 12,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ]
      }
    },
    {
      "id": "84",
      "pokedexId": 84,
      "name": "嘟嘟",
      "sourceNameZh": "嘟嘟",
      "nameEn": "Doduo",
      "specialty": "berry",
      "typeId": 10,
      "berryId": 10,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3800,
      "carryLimitBase": 13,
      "carryLimitRaisedFromFirstStage": 13,
      "ingredientRate": 0.184,
      "skillRatePct": 2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "84",
        "previous": null,
        "next": [
          {
            "id": "85",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 23
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "85"
      ],
      "defaultFinalId": "85",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 1,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "85",
      "pokedexId": 85,
      "name": "嘟嘟利",
      "sourceNameZh": "嘟嘟利",
      "nameEn": "Dodrio",
      "specialty": "berry",
      "typeId": 10,
      "berryId": 10,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2300,
      "carryLimitBase": 21,
      "carryLimitRaisedFromFirstStage": 26,
      "ingredientRate": 0.184,
      "skillRatePct": 2,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "84",
        "previous": {
          "id": "84",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "85"
      ],
      "defaultFinalId": "85",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 1,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "92",
      "pokedexId": 92,
      "name": "鬼斯",
      "sourceNameZh": "鬼斯",
      "nameEn": "Gastly",
      "specialty": "ingredient",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3800,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.144,
      "skillRatePct": 1.5,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "92",
        "previous": null,
        "next": [
          {
            "id": "93",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 19
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "94"
      ],
      "defaultFinalId": "94",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 5,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 7,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 6,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 8,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "93",
      "pokedexId": 93,
      "name": "鬼斯通",
      "sourceNameZh": "鬼斯通",
      "nameEn": "Haunter",
      "specialty": "ingredient",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3000,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.157,
      "skillRatePct": 2.2,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "92",
        "previous": {
          "id": "92",
          "conditions": []
        },
        "next": [
          {
            "id": "94",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 21,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "94"
      ],
      "defaultFinalId": "94",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 5,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 7,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 6,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 8,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "94",
      "pokedexId": 94,
      "name": "耿鬼",
      "sourceNameZh": "耿鬼",
      "nameEn": "Gengar",
      "specialty": "ingredient",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2200,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 28,
      "ingredientRate": 0.161,
      "skillRatePct": 2.4,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "92",
        "previous": {
          "id": "93",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "94"
      ],
      "defaultFinalId": "94",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 5,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 7,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 6,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 8,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "95",
      "pokedexId": 95,
      "name": "大岩蛇",
      "sourceNameZh": "大岩蛇",
      "nameEn": "Onix",
      "specialty": "berry",
      "typeId": 13,
      "berryId": 13,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3100,
      "carryLimitBase": 22,
      "carryLimitRaisedFromFirstStage": 22,
      "ingredientRate": 0.132,
      "skillRatePct": 2.3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "95",
        "previous": null,
        "next": [
          {
            "id": "208",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 29,
                "count": 1
              },
              {
                "type": "item",
                "item": 21,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "208"
      ],
      "defaultFinalId": "208",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 1,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "104",
      "pokedexId": 104,
      "name": "卡拉卡拉",
      "sourceNameZh": "卡拉卡拉",
      "nameEn": "Cubone",
      "specialty": "berry",
      "typeId": 9,
      "berryId": 9,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4800,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.223,
      "skillRatePct": 4.4,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "104",
        "previous": null,
        "next": [
          {
            "id": "105",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 21
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "105"
      ],
      "defaultFinalId": "105",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 11,
            "code": "A",
            "quantity": 1,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "30": [
          {
            "id": 11,
            "code": "A",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 11,
            "code": "A",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ]
      }
    },
    {
      "id": "105",
      "pokedexId": 105,
      "name": "嘎啦嘎啦",
      "sourceNameZh": "嘎啦嘎啦",
      "nameEn": "Marowak",
      "specialty": "berry",
      "typeId": 9,
      "berryId": 9,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3300,
      "carryLimitBase": 15,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.225,
      "skillRatePct": 4.5,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "104",
        "previous": {
          "id": "104",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "105"
      ],
      "defaultFinalId": "105",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 11,
            "code": "A",
            "quantity": 1,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "30": [
          {
            "id": 11,
            "code": "A",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 11,
            "code": "A",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ]
      }
    },
    {
      "id": "113",
      "pokedexId": 113,
      "name": "吉利蛋",
      "sourceNameZh": "吉利蛋",
      "nameEn": "Chansey",
      "specialty": "ingredient",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3300,
      "carryLimitBase": 15,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.236,
      "skillRatePct": 2.3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "440",
        "previous": {
          "id": "440",
          "conditions": []
        },
        "next": [
          {
            "id": "242",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "sleepTime",
                "hours": 150
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "242"
      ],
      "defaultFinalId": "242",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 5,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 7,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 7,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 8,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "115",
      "pokedexId": 115,
      "name": "袋兽",
      "sourceNameZh": "袋獸",
      "nameEn": "Kangaskhan",
      "specialty": "ingredient",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2650,
      "carryLimitBase": 21,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.222,
      "skillRatePct": 3.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "115",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "115"
      ],
      "defaultFinalId": "115",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 11,
            "code": "A",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "30": [
          {
            "id": 11,
            "code": "A",
            "quantity": 5,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 11,
            "code": "A",
            "quantity": 7,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 8,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "122",
      "pokedexId": 122,
      "name": "魔墙人偶",
      "sourceNameZh": "魔牆人偶",
      "nameEn": "Mr. Mime",
      "specialty": "ingredient",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 22,
      "ingredientRate": 0.216,
      "skillRatePct": 3.9,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "439",
        "previous": {
          "id": "439",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "122"
      ],
      "defaultFinalId": "122",
      "mainSkill": {
        "id": 20,
        "name": "模仿（技能复制）",
        "nameEn": "Mimic (Skill Copy)"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 4,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "127",
      "pokedexId": 127,
      "name": "凯罗斯",
      "sourceNameZh": "凱羅斯",
      "nameEn": "Pinsir",
      "specialty": "ingredient",
      "typeId": 12,
      "berryId": 12,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 24,
      "carryLimitRaisedFromFirstStage": 24,
      "ingredientRate": 0.216,
      "skillRatePct": 3.1,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "127",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "127"
      ],
      "defaultFinalId": "127",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 5,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 5,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 7,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 8,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 7,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "132",
      "pokedexId": 132,
      "name": "百变怪",
      "sourceNameZh": "百變怪",
      "nameEn": "Ditto",
      "specialty": "ingredient",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3500,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 17,
      "ingredientRate": 0.201,
      "skillRatePct": 3.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "132",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "132"
      ],
      "defaultFinalId": "132",
      "mainSkill": {
        "id": 19,
        "name": "变身（技能复制）",
        "nameEn": "Transform (Skill Copy)"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 5,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 3,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 7,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 5,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 14,
            "code": "C",
            "quantity": 3,
            "name": "美味尾巴",
            "nameEn": "Slowpoke Tail"
          }
        ]
      }
    },
    {
      "id": "133",
      "pokedexId": 133,
      "name": "伊布",
      "sourceNameZh": "伊布",
      "nameEn": "Eevee",
      "specialty": "skill",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3700,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 12,
      "ingredientRate": 0.192,
      "skillRatePct": 5.5,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "133",
        "previous": null,
        "next": [
          {
            "id": "134",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 23,
                "count": 1
              }
            ]
          },
          {
            "id": "135",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 24,
                "count": 1
              }
            ]
          },
          {
            "id": "136",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 22,
                "count": 1
              }
            ]
          },
          {
            "id": "197",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "sleepTime",
                "hours": 150
              },
              {
                "type": "timing",
                "startHour": 18,
                "endHour": 6
              }
            ]
          },
          {
            "id": "196",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "sleepTime",
                "hours": 150
              },
              {
                "type": "timing",
                "startHour": 6,
                "endHour": 18
              }
            ]
          },
          {
            "id": "470",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 25,
                "count": 1
              }
            ]
          },
          {
            "id": "471",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 26,
                "count": 1
              }
            ]
          },
          {
            "id": "700",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "sleepTime",
                "hours": 150
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "134",
        "135",
        "136",
        "197",
        "196",
        "470",
        "471",
        "700"
      ],
      "defaultFinalId": "700",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "134",
      "pokedexId": 134,
      "name": "水伊布",
      "sourceNameZh": "水伊布",
      "nameEn": "Vaporeon",
      "specialty": "skill",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3100,
      "carryLimitBase": 13,
      "carryLimitRaisedFromFirstStage": 18,
      "ingredientRate": 0.212,
      "skillRatePct": 6.1,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "133",
        "previous": {
          "id": "133",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "134"
      ],
      "defaultFinalId": "134",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "135",
      "pokedexId": 135,
      "name": "雷伊布",
      "sourceNameZh": "雷伊布",
      "nameEn": "Jolteon",
      "specialty": "skill",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2200,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 22,
      "ingredientRate": 0.151,
      "skillRatePct": 3.9,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "133",
        "previous": {
          "id": "133",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "135"
      ],
      "defaultFinalId": "135",
      "mainSkill": {
        "id": 9,
        "name": "帮手支援S",
        "nameEn": "Extra Helpful S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "136",
      "pokedexId": 136,
      "name": "火伊布",
      "sourceNameZh": "火伊布",
      "nameEn": "Flareon",
      "specialty": "skill",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2700,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.185,
      "skillRatePct": 5.2,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "133",
        "previous": {
          "id": "133",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "136"
      ],
      "defaultFinalId": "136",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "147",
      "pokedexId": 147,
      "name": "迷你龙",
      "sourceNameZh": "迷你龍",
      "nameEn": "Dratini",
      "specialty": "ingredient",
      "typeId": 15,
      "berryId": 15,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5000,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.25,
      "skillRatePct": 2,
      "expType": 2,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "147",
        "previous": null,
        "next": [
          {
            "id": "148",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 23
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "149"
      ],
      "defaultFinalId": "149",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 5,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 4,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 7,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 7,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 8,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "148",
      "pokedexId": 148,
      "name": "哈克龙",
      "sourceNameZh": "哈克龍",
      "nameEn": "Dragonair",
      "specialty": "ingredient",
      "typeId": 15,
      "berryId": 15,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3800,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 17,
      "ingredientRate": 0.262,
      "skillRatePct": 2.5,
      "expType": 2,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "147",
        "previous": {
          "id": "147",
          "conditions": []
        },
        "next": [
          {
            "id": "149",
            "conditions": [
              {
                "type": "candy",
                "count": 100
              },
              {
                "type": "level",
                "level": 41
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "149"
      ],
      "defaultFinalId": "149",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 5,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 4,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 7,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 7,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 8,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "149",
      "pokedexId": 149,
      "name": "快龙",
      "sourceNameZh": "快龍",
      "nameEn": "Dragonite",
      "specialty": "ingredient",
      "typeId": 15,
      "berryId": 15,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2600,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 30,
      "ingredientRate": 0.264,
      "skillRatePct": 2.6,
      "expType": 2,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "147",
        "previous": {
          "id": "148",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "149"
      ],
      "defaultFinalId": "149",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 5,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 4,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 7,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 7,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 8,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "151",
      "pokedexId": 151,
      "name": "梦幻",
      "sourceNameZh": "夢幻",
      "nameEn": "Mew",
      "specialty": "all",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2900,
      "carryLimitBase": 26,
      "carryLimitRaisedFromFirstStage": 26,
      "ingredientRate": 0.2,
      "skillRatePct": 4,
      "expType": 4,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "151",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "151"
      ],
      "defaultFinalId": "151",
      "mainSkill": {
        "id": 33,
        "name": "十项全能",
        "nameEn": "Versatile"
      },
      "ingredients": {
        "1": [],
        "30": [],
        "60": []
      }
    },
    {
      "id": "152",
      "pokedexId": 152,
      "name": "菊草叶",
      "sourceNameZh": "菊草葉",
      "nameEn": "Chikorita",
      "specialty": "berry",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4400,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 12,
      "ingredientRate": 0.169,
      "skillRatePct": 3.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "152",
        "previous": null,
        "next": [
          {
            "id": "153",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "154"
      ],
      "defaultFinalId": "154",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 3,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 4,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 5,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 3,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "153",
      "pokedexId": 153,
      "name": "月桂叶",
      "sourceNameZh": "月桂葉",
      "nameEn": "Bayleef",
      "specialty": "berry",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3300,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 22,
      "ingredientRate": 0.168,
      "skillRatePct": 3.8,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "152",
        "previous": {
          "id": "152",
          "conditions": []
        },
        "next": [
          {
            "id": "154",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 24
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "154"
      ],
      "defaultFinalId": "154",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 3,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 4,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 5,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 3,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "154",
      "pokedexId": 154,
      "name": "大竺葵",
      "sourceNameZh": "大竺葵",
      "nameEn": "Meganium",
      "specialty": "berry",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 30,
      "ingredientRate": 0.175,
      "skillRatePct": 4.6,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "152",
        "previous": {
          "id": "153",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "154"
      ],
      "defaultFinalId": "154",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 3,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 4,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 5,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 3,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "155",
      "pokedexId": 155,
      "name": "火球鼠",
      "sourceNameZh": "火球鼠",
      "nameEn": "Cyndaquil",
      "specialty": "berry",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3500,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 14,
      "ingredientRate": 0.186,
      "skillRatePct": 2.1,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "155",
        "previous": null,
        "next": [
          {
            "id": "156",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 11
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "157"
      ],
      "defaultFinalId": "157",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 11,
            "code": "A",
            "quantity": 1,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "30": [
          {
            "id": 11,
            "code": "A",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "60": [
          {
            "id": 11,
            "code": "A",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 3,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "156",
      "pokedexId": 156,
      "name": "火岩鼠",
      "sourceNameZh": "火岩鼠",
      "nameEn": "Quilava",
      "specialty": "berry",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3000,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 23,
      "ingredientRate": 0.211,
      "skillRatePct": 4.1,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "155",
        "previous": {
          "id": "155",
          "conditions": []
        },
        "next": [
          {
            "id": "157",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 27
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "157"
      ],
      "defaultFinalId": "157",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 11,
            "code": "A",
            "quantity": 1,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "30": [
          {
            "id": 11,
            "code": "A",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "60": [
          {
            "id": 11,
            "code": "A",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 3,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "157",
      "pokedexId": 157,
      "name": "火爆兽",
      "sourceNameZh": "火爆獸",
      "nameEn": "Typhlosion",
      "specialty": "berry",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 23,
      "carryLimitRaisedFromFirstStage": 33,
      "ingredientRate": 0.208,
      "skillRatePct": 3.9,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "155",
        "previous": {
          "id": "156",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "157"
      ],
      "defaultFinalId": "157",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 11,
            "code": "A",
            "quantity": 1,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "30": [
          {
            "id": 11,
            "code": "A",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "60": [
          {
            "id": 11,
            "code": "A",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 3,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "158",
      "pokedexId": 158,
      "name": "小锯鳄",
      "sourceNameZh": "小鋸鱷",
      "nameEn": "Totodile",
      "specialty": "berry",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4500,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.253,
      "skillRatePct": 5.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "158",
        "previous": null,
        "next": [
          {
            "id": "159",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 14
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "160"
      ],
      "defaultFinalId": "160",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "159",
      "pokedexId": 159,
      "name": "蓝鳄",
      "sourceNameZh": "藍鱷",
      "nameEn": "Croconaw",
      "specialty": "berry",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3400,
      "carryLimitBase": 15,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.253,
      "skillRatePct": 5.2,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "158",
        "previous": {
          "id": "158",
          "conditions": []
        },
        "next": [
          {
            "id": "160",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 23
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "160"
      ],
      "defaultFinalId": "160",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "160",
      "pokedexId": 160,
      "name": "大力鳄",
      "sourceNameZh": "大力鱷",
      "nameEn": "Feraligatr",
      "specialty": "berry",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 29,
      "ingredientRate": 0.257,
      "skillRatePct": 5.5,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "158",
        "previous": {
          "id": "159",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "160"
      ],
      "defaultFinalId": "160",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "172",
      "pokedexId": 172,
      "name": "皮丘",
      "sourceNameZh": "皮丘",
      "nameEn": "Pichu",
      "specialty": "berry",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4300,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.21,
      "skillRatePct": 2.3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "172",
        "previous": null,
        "next": [
          {
            "id": "25",
            "conditions": [
              {
                "type": "candy",
                "count": 20
              },
              {
                "type": "sleepTime",
                "hours": 50
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "26"
      ],
      "defaultFinalId": "26",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "173",
      "pokedexId": 173,
      "name": "皮宝宝",
      "sourceNameZh": "皮寶寶",
      "nameEn": "Cleffa",
      "specialty": "berry",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 5600,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.164,
      "skillRatePct": 3.4,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "173",
        "previous": null,
        "next": [
          {
            "id": "35",
            "conditions": [
              {
                "type": "candy",
                "count": 20
              },
              {
                "type": "sleepTime",
                "hours": 50
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "36"
      ],
      "defaultFinalId": "36",
      "mainSkill": {
        "id": 13,
        "name": "挥指",
        "nameEn": "Metronome"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 3,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 3,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "174",
      "pokedexId": 174,
      "name": "宝宝丁",
      "sourceNameZh": "寶寶丁",
      "nameEn": "Igglybuff",
      "specialty": "skill",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5200,
      "carryLimitBase": 8,
      "carryLimitRaisedFromFirstStage": 8,
      "ingredientRate": 0.17,
      "skillRatePct": 3.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "174",
        "previous": null,
        "next": [
          {
            "id": "39",
            "conditions": [
              {
                "type": "candy",
                "count": 20
              },
              {
                "type": "sleepTime",
                "hours": 50
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "40"
      ],
      "defaultFinalId": "40",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 1,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 13,
            "code": "C",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ]
      }
    },
    {
      "id": "175",
      "pokedexId": 175,
      "name": "波克比",
      "sourceNameZh": "波克比",
      "nameEn": "Togepi",
      "specialty": "skill",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4800,
      "carryLimitBase": 8,
      "carryLimitRaisedFromFirstStage": 8,
      "ingredientRate": 0.151,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "175",
        "previous": null,
        "next": [
          {
            "id": "176",
            "conditions": [
              {
                "type": "candy",
                "count": 20
              },
              {
                "type": "sleepTime",
                "hours": 50
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "468"
      ],
      "defaultFinalId": "468",
      "mainSkill": {
        "id": 13,
        "name": "挥指",
        "nameEn": "Metronome"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 13,
            "code": "C",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ]
      }
    },
    {
      "id": "176",
      "pokedexId": 176,
      "name": "波克基古",
      "sourceNameZh": "波克基古",
      "nameEn": "Togetic",
      "specialty": "skill",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3800,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 15,
      "ingredientRate": 0.163,
      "skillRatePct": 5.6,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "175",
        "previous": {
          "id": "175",
          "conditions": []
        },
        "next": [
          {
            "id": "468",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 28,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "468"
      ],
      "defaultFinalId": "468",
      "mainSkill": {
        "id": 13,
        "name": "挥指",
        "nameEn": "Metronome"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 13,
            "code": "C",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ]
      }
    },
    {
      "id": "177",
      "pokedexId": 177,
      "name": "天然雀",
      "sourceNameZh": "天然雀",
      "nameEn": "Natu",
      "specialty": "berry",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4500,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.185,
      "skillRatePct": 1.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "177",
        "previous": null,
        "next": [
          {
            "id": "178",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 19
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "178"
      ],
      "defaultFinalId": "178",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 5,
            "code": "C",
            "quantity": 5,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ]
      }
    },
    {
      "id": "178",
      "pokedexId": 178,
      "name": "天然鸟",
      "sourceNameZh": "天然鳥",
      "nameEn": "Xatu",
      "specialty": "berry",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 24,
      "ingredientRate": 0.191,
      "skillRatePct": 2.5,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "177",
        "previous": {
          "id": "177",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "178"
      ],
      "defaultFinalId": "178",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 5,
            "code": "C",
            "quantity": 5,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ]
      }
    },
    {
      "id": "179",
      "pokedexId": 179,
      "name": "咩利羊",
      "sourceNameZh": "咩利羊",
      "nameEn": "Mareep",
      "specialty": "skill",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4600,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.128,
      "skillRatePct": 4.7,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "179",
        "previous": null,
        "next": [
          {
            "id": "180",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 11
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "181"
      ],
      "defaultFinalId": "181",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 1,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "180",
      "pokedexId": 180,
      "name": "茸茸羊",
      "sourceNameZh": "茸茸羊",
      "nameEn": "Flaaffy",
      "specialty": "skill",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3300,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 16,
      "ingredientRate": 0.127,
      "skillRatePct": 4.6,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "179",
        "previous": {
          "id": "179",
          "conditions": []
        },
        "next": [
          {
            "id": "181",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 23
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "181"
      ],
      "defaultFinalId": "181",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 1,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "181",
      "pokedexId": 181,
      "name": "电龙",
      "sourceNameZh": "電龍",
      "nameEn": "Ampharos",
      "specialty": "skill",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 15,
      "carryLimitRaisedFromFirstStage": 25,
      "ingredientRate": 0.13,
      "skillRatePct": 4.7,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "179",
        "previous": {
          "id": "180",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "181"
      ],
      "defaultFinalId": "181",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 1,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "185",
      "pokedexId": 185,
      "name": "树才怪",
      "sourceNameZh": "樹才怪",
      "nameEn": "Sudowoodo",
      "specialty": "skill",
      "typeId": 13,
      "berryId": 13,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4000,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.217,
      "skillRatePct": 7.2,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "438",
        "previous": {
          "id": "438",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "185"
      ],
      "defaultFinalId": "185",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 1,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "194",
      "pokedexId": 194,
      "name": "乌波",
      "sourceNameZh": "烏波",
      "nameEn": "Wooper",
      "specialty": "ingredient",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5900,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.201,
      "skillRatePct": 3.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "194",
        "previous": null,
        "next": [
          {
            "id": "195",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 15
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "195"
      ],
      "defaultFinalId": "195",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 2,
            "code": "A",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "30": [
          {
            "id": 2,
            "code": "A",
            "quantity": 5,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 2,
            "code": "A",
            "quantity": 7,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 10,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 12,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "195",
      "pokedexId": 195,
      "name": "沼王",
      "sourceNameZh": "沼王",
      "nameEn": "Quagsire",
      "specialty": "ingredient",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3400,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.19,
      "skillRatePct": 3.2,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "194",
        "previous": {
          "id": "194",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "195"
      ],
      "defaultFinalId": "195",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 2,
            "code": "A",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "30": [
          {
            "id": 2,
            "code": "A",
            "quantity": 5,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 2,
            "code": "A",
            "quantity": 7,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 10,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 12,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "196",
      "pokedexId": 196,
      "name": "太阳伊布",
      "sourceNameZh": "太陽伊布",
      "nameEn": "Espeon",
      "specialty": "skill",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.164,
      "skillRatePct": 4.4,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "133",
        "previous": {
          "id": "133",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "196"
      ],
      "defaultFinalId": "196",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "197",
      "pokedexId": 197,
      "name": "月亮伊布",
      "sourceNameZh": "月亮伊布",
      "nameEn": "Umbreon",
      "specialty": "skill",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3200,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.219,
      "skillRatePct": 10.1,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "133",
        "previous": {
          "id": "133",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "197"
      ],
      "defaultFinalId": "197",
      "mainSkill": {
        "id": 18,
        "name": "月光（活力填充S）",
        "nameEn": "Moonlight (Charge Energy S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "198",
      "pokedexId": 198,
      "name": "黑暗鸦",
      "sourceNameZh": "黑暗鴉",
      "nameEn": "Murkrow",
      "specialty": "skill",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3600,
      "carryLimitBase": 13,
      "carryLimitRaisedFromFirstStage": 13,
      "ingredientRate": 0.141,
      "skillRatePct": 6.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "198",
        "previous": null,
        "next": [
          {
            "id": "430",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 102,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "430"
      ],
      "defaultFinalId": "430",
      "mainSkill": {
        "id": 24,
        "name": "超幸运（食材精选S）",
        "nameEn": "Super Luck (Ingredient Draw S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 17,
            "code": "A",
            "quantity": 1,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "30": [
          {
            "id": 17,
            "code": "A",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 3,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 17,
            "code": "A",
            "quantity": 4,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 6,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 6,
            "code": "C",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "199",
      "pokedexId": 199,
      "name": "呆呆王",
      "sourceNameZh": "呆呆王",
      "nameEn": "Slowking",
      "specialty": "skill",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3400,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 22,
      "ingredientRate": 0.166,
      "skillRatePct": 8.7,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "79",
        "previous": {
          "id": "79",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "199"
      ],
      "defaultFinalId": "199",
      "mainSkill": {
        "id": 4,
        "name": "活力疗愈S",
        "nameEn": "Energizing Cheer S"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 14,
            "code": "B",
            "quantity": 1,
            "name": "美味尾巴",
            "nameEn": "Slowpoke Tail"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 4,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 14,
            "code": "B",
            "quantity": 2,
            "name": "美味尾巴",
            "nameEn": "Slowpoke Tail"
          },
          {
            "id": 12,
            "code": "C",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ]
      }
    },
    {
      "id": "202",
      "pokedexId": 202,
      "name": "果然翁",
      "sourceNameZh": "果然翁",
      "nameEn": "Wobbuffet",
      "specialty": "skill",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3500,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.211,
      "skillRatePct": 8.2,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "360",
        "previous": {
          "id": "360",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "202"
      ],
      "defaultFinalId": "202",
      "mainSkill": {
        "id": 4,
        "name": "活力疗愈S",
        "nameEn": "Energizing Cheer S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "208",
      "pokedexId": 208,
      "name": "大钢蛇",
      "sourceNameZh": "大鋼蛇",
      "nameEn": "Steelix",
      "specialty": "berry",
      "typeId": 17,
      "berryId": 17,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3000,
      "carryLimitBase": 25,
      "carryLimitRaisedFromFirstStage": 30,
      "ingredientRate": 0.154,
      "skillRatePct": 3.2,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "95",
        "previous": {
          "id": "95",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "208"
      ],
      "defaultFinalId": "208",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 1,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "213",
      "pokedexId": 213,
      "name": "壶壶",
      "sourceNameZh": "壺壺",
      "nameEn": "Shuckle",
      "specialty": "skill",
      "typeId": 12,
      "berryId": 12,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3600,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 16,
      "ingredientRate": 0.205,
      "skillRatePct": 5.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "213",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "213"
      ],
      "defaultFinalId": "213",
      "mainSkill": {
        "id": 32,
        "name": "树果汁（活力全体疗愈S）",
        "nameEn": "Berry Juice (Energy for Everyone S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 3,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "214",
      "pokedexId": 214,
      "name": "赫拉克罗斯",
      "sourceNameZh": "赫拉克羅斯",
      "nameEn": "Heracross",
      "specialty": "skill",
      "typeId": 12,
      "berryId": 12,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2300,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.158,
      "skillRatePct": 4.7,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "214",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "214"
      ],
      "defaultFinalId": "214",
      "mainSkill": {
        "id": 31,
        "name": "健美（料理辅助S）",
        "nameEn": "Bulk Up (Cooking Assist S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 1,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "215",
      "pokedexId": 215,
      "name": "狃拉",
      "sourceNameZh": "狃拉",
      "nameEn": "Sneasel",
      "specialty": "berry",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3200,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 17,
      "ingredientRate": 0.255,
      "skillRatePct": 1.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "215",
        "previous": null,
        "next": [
          {
            "id": "461",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 97,
                "count": 1
              },
              {
                "type": "timing",
                "startHour": 18,
                "endHour": 6
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "461"
      ],
      "defaultFinalId": "461",
      "mainSkill": {
        "id": 14,
        "name": "料理成功S",
        "nameEn": "Tasty Chance S"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "225",
      "pokedexId": 225,
      "name": "信使鸟",
      "sourceNameZh": "信使鳥",
      "nameEn": "Delibird",
      "specialty": "ingredient",
      "typeId": 10,
      "berryId": 10,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.188,
      "skillRatePct": 3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "225",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "225"
      ],
      "defaultFinalId": "225",
      "mainSkill": {
        "id": 29,
        "name": "礼物（食材获取S）",
        "nameEn": "Present (Ingredient Magnet S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 5,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 6,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 7,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 9,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 13,
            "code": "C",
            "quantity": 5,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ]
      }
    },
    {
      "id": "228",
      "pokedexId": 228,
      "name": "戴鲁比",
      "sourceNameZh": "戴魯比",
      "nameEn": "Houndour",
      "specialty": "berry",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4900,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.201,
      "skillRatePct": 3.7,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "228",
        "previous": null,
        "next": [
          {
            "id": "229",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 18
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "229"
      ],
      "defaultFinalId": "229",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 1,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 3,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "229",
      "pokedexId": 229,
      "name": "黑鲁加",
      "sourceNameZh": "黑魯加",
      "nameEn": "Houndoom",
      "specialty": "berry",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3300,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.203,
      "skillRatePct": 4,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "228",
        "previous": {
          "id": "228",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "229"
      ],
      "defaultFinalId": "229",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 1,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 3,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "242",
      "pokedexId": 242,
      "name": "幸福蛋",
      "sourceNameZh": "幸福蛋",
      "nameEn": "Blissey",
      "specialty": "ingredient",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3100,
      "carryLimitBase": 21,
      "carryLimitRaisedFromFirstStage": 31,
      "ingredientRate": 0.238,
      "skillRatePct": 2.3,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "440",
        "previous": {
          "id": "113",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "242"
      ],
      "defaultFinalId": "242",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 5,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 7,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 7,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 8,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "243",
      "pokedexId": 243,
      "name": "雷公",
      "sourceNameZh": "雷公",
      "nameEn": "Raikou",
      "specialty": "skill",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2100,
      "carryLimitBase": 22,
      "carryLimitRaisedFromFirstStage": 22,
      "ingredientRate": 0.192,
      "skillRatePct": 1.9,
      "expType": 3,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "243",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "243"
      ],
      "defaultFinalId": "243",
      "mainSkill": {
        "id": 15,
        "name": "帮手加速",
        "nameEn": "Helper Boost"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 3,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "244",
      "pokedexId": 244,
      "name": "炎帝",
      "sourceNameZh": "炎帝",
      "nameEn": "Entei",
      "specialty": "skill",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.187,
      "skillRatePct": 2.3,
      "expType": 3,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "244",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "244"
      ],
      "defaultFinalId": "244",
      "mainSkill": {
        "id": 15,
        "name": "帮手加速",
        "nameEn": "Helper Boost"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 12,
            "code": "B",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 3,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "245",
      "pokedexId": 245,
      "name": "水君",
      "sourceNameZh": "水君",
      "nameEn": "Suicune",
      "specialty": "skill",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2700,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 17,
      "ingredientRate": 0.277,
      "skillRatePct": 2.6,
      "expType": 3,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "245",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "245"
      ],
      "defaultFinalId": "245",
      "mainSkill": {
        "id": 15,
        "name": "帮手加速",
        "nameEn": "Helper Boost"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 16,
            "code": "C",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ]
      }
    },
    {
      "id": "246",
      "pokedexId": 246,
      "name": "幼基拉斯",
      "sourceNameZh": "幼基拉斯",
      "nameEn": "Larvitar",
      "specialty": "ingredient",
      "typeId": 13,
      "berryId": 13,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4800,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.238,
      "skillRatePct": 4.1,
      "expType": 2,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "246",
        "previous": null,
        "next": [
          {
            "id": "247",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 23
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "248"
      ],
      "defaultFinalId": "248",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 11,
            "code": "A",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "30": [
          {
            "id": 11,
            "code": "A",
            "quantity": 5,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 5,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 11,
            "code": "A",
            "quantity": 7,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 8,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 8,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "247",
      "pokedexId": 247,
      "name": "沙基拉斯",
      "sourceNameZh": "沙基拉斯",
      "nameEn": "Pupitar",
      "specialty": "ingredient",
      "typeId": 13,
      "berryId": 13,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3600,
      "carryLimitBase": 13,
      "carryLimitRaisedFromFirstStage": 18,
      "ingredientRate": 0.247,
      "skillRatePct": 4.5,
      "expType": 2,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "246",
        "previous": {
          "id": "246",
          "conditions": []
        },
        "next": [
          {
            "id": "248",
            "conditions": [
              {
                "type": "candy",
                "count": 100
              },
              {
                "type": "level",
                "level": 41
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "248"
      ],
      "defaultFinalId": "248",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 11,
            "code": "A",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "30": [
          {
            "id": 11,
            "code": "A",
            "quantity": 5,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 5,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 11,
            "code": "A",
            "quantity": 7,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 8,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 8,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "248",
      "pokedexId": 248,
      "name": "班基拉斯",
      "sourceNameZh": "班基拉斯",
      "nameEn": "Tyranitar",
      "specialty": "ingredient",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2700,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 29,
      "ingredientRate": 0.266,
      "skillRatePct": 5.2,
      "expType": 2,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "246",
        "previous": {
          "id": "247",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "248"
      ],
      "defaultFinalId": "248",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 11,
            "code": "A",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "30": [
          {
            "id": 11,
            "code": "A",
            "quantity": 5,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 5,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 11,
            "code": "A",
            "quantity": 7,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 8,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 8,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "252",
      "pokedexId": 252,
      "name": "木守宫",
      "sourceNameZh": "木守宮",
      "nameEn": "Treecko",
      "specialty": "skill",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4500,
      "carryLimitBase": 8,
      "carryLimitRaisedFromFirstStage": 8,
      "ingredientRate": 0.172,
      "skillRatePct": 3.5,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "252",
        "previous": null,
        "next": [
          {
            "id": "253",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "254"
      ],
      "defaultFinalId": "254",
      "mainSkill": {
        "id": 21,
        "name": "树果骤增",
        "nameEn": "Berry Burst"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 3,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "253",
      "pokedexId": 253,
      "name": "森林蜥蜴",
      "sourceNameZh": "森林蜥蜴",
      "nameEn": "Grovyle",
      "specialty": "skill",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3300,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 16,
      "ingredientRate": 0.15,
      "skillRatePct": 3.5,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "252",
        "previous": {
          "id": "252",
          "conditions": []
        },
        "next": [
          {
            "id": "254",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 27
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "254"
      ],
      "defaultFinalId": "254",
      "mainSkill": {
        "id": 21,
        "name": "树果骤增",
        "nameEn": "Berry Burst"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 3,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "254",
      "pokedexId": 254,
      "name": "蜥蜴王",
      "sourceNameZh": "蜥蜴王",
      "nameEn": "Sceptile",
      "specialty": "skill",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2300,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 27,
      "ingredientRate": 0.107,
      "skillRatePct": 3,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "252",
        "previous": {
          "id": "253",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "254"
      ],
      "defaultFinalId": "254",
      "mainSkill": {
        "id": 21,
        "name": "树果骤增",
        "nameEn": "Berry Burst"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 3,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "255",
      "pokedexId": 255,
      "name": "火稚鸡",
      "sourceNameZh": "火稚雞",
      "nameEn": "Torchic",
      "specialty": "berry",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4300,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 12,
      "ingredientRate": 0.16,
      "skillRatePct": 4.4,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "255",
        "previous": null,
        "next": [
          {
            "id": "256",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "257"
      ],
      "defaultFinalId": "257",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 2,
            "code": "A",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "30": [
          {
            "id": 2,
            "code": "A",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 2,
            "code": "A",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 6,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 5,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "256",
      "pokedexId": 256,
      "name": "力壮鸡",
      "sourceNameZh": "力壯雞",
      "nameEn": "Combusken",
      "specialty": "berry",
      "typeId": 7,
      "berryId": 7,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3400,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.17,
      "skillRatePct": 5.2,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "255",
        "previous": {
          "id": "255",
          "conditions": []
        },
        "next": [
          {
            "id": "257",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 27
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "257"
      ],
      "defaultFinalId": "257",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 2,
            "code": "A",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "30": [
          {
            "id": 2,
            "code": "A",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 2,
            "code": "A",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 6,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 5,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "257",
      "pokedexId": 257,
      "name": "火焰鸡",
      "sourceNameZh": "火焰雞",
      "nameEn": "Blaziken",
      "specialty": "berry",
      "typeId": 7,
      "berryId": 7,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2600,
      "carryLimitBase": 22,
      "carryLimitRaisedFromFirstStage": 32,
      "ingredientRate": 0.153,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "255",
        "previous": {
          "id": "256",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "257"
      ],
      "defaultFinalId": "257",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 2,
            "code": "A",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "30": [
          {
            "id": 2,
            "code": "A",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 2,
            "code": "A",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 6,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 5,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "258",
      "pokedexId": 258,
      "name": "水跃鱼",
      "sourceNameZh": "水躍魚",
      "nameEn": "Mudkip",
      "specialty": "berry",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4700,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.192,
      "skillRatePct": 2.4,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "258",
        "previous": null,
        "next": [
          {
            "id": "259",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "260"
      ],
      "defaultFinalId": "260",
      "mainSkill": {
        "id": 14,
        "name": "料理成功S",
        "nameEn": "Tasty Chance S"
      },
      "ingredients": {
        "1": [
          {
            "id": 16,
            "code": "A",
            "quantity": 1,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "30": [
          {
            "id": 16,
            "code": "A",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 3,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "60": [
          {
            "id": 16,
            "code": "A",
            "quantity": 4,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 5,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 3,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "259",
      "pokedexId": 259,
      "name": "沼跃鱼",
      "sourceNameZh": "沼躍魚",
      "nameEn": "Marshtomp",
      "specialty": "berry",
      "typeId": 9,
      "berryId": 9,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3500,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.168,
      "skillRatePct": 2.8,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "258",
        "previous": {
          "id": "258",
          "conditions": []
        },
        "next": [
          {
            "id": "260",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 27
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "260"
      ],
      "defaultFinalId": "260",
      "mainSkill": {
        "id": 14,
        "name": "料理成功S",
        "nameEn": "Tasty Chance S"
      },
      "ingredients": {
        "1": [
          {
            "id": 16,
            "code": "A",
            "quantity": 1,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "30": [
          {
            "id": 16,
            "code": "A",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 3,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "60": [
          {
            "id": 16,
            "code": "A",
            "quantity": 4,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 5,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 3,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "260",
      "pokedexId": 260,
      "name": "巨沼怪",
      "sourceNameZh": "巨沼怪",
      "nameEn": "Swampert",
      "specialty": "berry",
      "typeId": 9,
      "berryId": 9,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 30,
      "ingredientRate": 0.146,
      "skillRatePct": 3.4,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "258",
        "previous": {
          "id": "259",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "260"
      ],
      "defaultFinalId": "260",
      "mainSkill": {
        "id": 14,
        "name": "料理成功S",
        "nameEn": "Tasty Chance S"
      },
      "ingredients": {
        "1": [
          {
            "id": 16,
            "code": "A",
            "quantity": 1,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "30": [
          {
            "id": 16,
            "code": "A",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 3,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "60": [
          {
            "id": 16,
            "code": "A",
            "quantity": 4,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 5,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 3,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "280",
      "pokedexId": 280,
      "name": "拉鲁拉丝",
      "sourceNameZh": "拉魯拉絲",
      "nameEn": "Ralts",
      "specialty": "skill",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4800,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.145,
      "skillRatePct": 4.3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "280",
        "previous": null,
        "next": [
          {
            "id": "281",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 15
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "282",
        "475"
      ],
      "defaultFinalId": "282",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 1,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "281",
      "pokedexId": 281,
      "name": "奇鲁莉安",
      "sourceNameZh": "奇魯莉安",
      "nameEn": "Kirlia",
      "specialty": "skill",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3500,
      "carryLimitBase": 13,
      "carryLimitRaisedFromFirstStage": 18,
      "ingredientRate": 0.146,
      "skillRatePct": 4.3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "280",
        "previous": {
          "id": "280",
          "conditions": []
        },
        "next": [
          {
            "id": "282",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 23
              }
            ]
          },
          {
            "id": "475",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "gender",
                "gender": "male"
              },
              {
                "type": "item",
                "item": 35,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "282",
        "475"
      ],
      "defaultFinalId": "282",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 1,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "282",
      "pokedexId": 282,
      "name": "沙奈朵",
      "sourceNameZh": "沙奈朵",
      "nameEn": "Gardevoir",
      "specialty": "skill",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 28,
      "ingredientRate": 0.144,
      "skillRatePct": 4.2,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "280",
        "previous": {
          "id": "281",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "282"
      ],
      "defaultFinalId": "282",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 1,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "287",
      "pokedexId": 287,
      "name": "懒人獭",
      "sourceNameZh": "懶人獺",
      "nameEn": "Slakoth",
      "specialty": "berry",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4900,
      "carryLimitBase": 7,
      "carryLimitRaisedFromFirstStage": 7,
      "ingredientRate": 0.216,
      "skillRatePct": 1.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "287",
        "previous": null,
        "next": [
          {
            "id": "288",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 14
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "289"
      ],
      "defaultFinalId": "289",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 1,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 5,
            "code": "C",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ]
      }
    },
    {
      "id": "288",
      "pokedexId": 288,
      "name": "过动猿",
      "sourceNameZh": "過動猿",
      "nameEn": "Vigoroth",
      "specialty": "berry",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3200,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 14,
      "ingredientRate": 0.204,
      "skillRatePct": 1.5,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "287",
        "previous": {
          "id": "287",
          "conditions": []
        },
        "next": [
          {
            "id": "289",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 27
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "289"
      ],
      "defaultFinalId": "289",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 1,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 5,
            "code": "C",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ]
      }
    },
    {
      "id": "289",
      "pokedexId": 289,
      "name": "请假王",
      "sourceNameZh": "請假王",
      "nameEn": "Slaking",
      "specialty": "berry",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3600,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 26,
      "ingredientRate": 0.339,
      "skillRatePct": 6.7,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "287",
        "previous": {
          "id": "288",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "289"
      ],
      "defaultFinalId": "289",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 1,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 5,
            "code": "C",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ]
      }
    },
    {
      "id": "302",
      "pokedexId": 302,
      "name": "勾魂眼",
      "sourceNameZh": "勾魂眼",
      "nameEn": "Sableye",
      "specialty": "skill",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3600,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 16,
      "ingredientRate": 0.188,
      "skillRatePct": 6.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "302",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "302"
      ],
      "defaultFinalId": "302",
      "mainSkill": {
        "id": 6,
        "name": "梦之碎片获取S（随机）",
        "nameEn": "Dream Shard Magnet S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 3,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 13,
            "code": "C",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ]
      }
    },
    {
      "id": "303",
      "pokedexId": 303,
      "name": "大嘴娃",
      "sourceNameZh": "大嘴娃",
      "nameEn": "Mawile",
      "specialty": "ingredient",
      "typeId": 17,
      "berryId": 17,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3200,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 17,
      "ingredientRate": 0.204,
      "skillRatePct": 3.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "303",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "303"
      ],
      "defaultFinalId": "303",
      "mainSkill": {
        "id": 25,
        "name": "怪力钳（食材精选S）",
        "nameEn": "Hyper Cutter (Ingredient Draw S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 5,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 4,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 7,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 6,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 12,
            "code": "C",
            "quantity": 8,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ]
      }
    },
    {
      "id": "304",
      "pokedexId": 304,
      "name": "可可多拉",
      "sourceNameZh": "可可多拉",
      "nameEn": "Aron",
      "specialty": "ingredient",
      "typeId": 17,
      "berryId": 17,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5700,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.273,
      "skillRatePct": 4.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "304",
        "previous": null,
        "next": [
          {
            "id": "305",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 24
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "306"
      ],
      "defaultFinalId": "306",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 3,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 7,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 5,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 7,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "305",
      "pokedexId": 305,
      "name": "可多拉",
      "sourceNameZh": "可多拉",
      "nameEn": "Lairon",
      "specialty": "ingredient",
      "typeId": 17,
      "berryId": 17,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4200,
      "carryLimitBase": 13,
      "carryLimitRaisedFromFirstStage": 18,
      "ingredientRate": 0.277,
      "skillRatePct": 4.8,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "304",
        "previous": {
          "id": "304",
          "conditions": []
        },
        "next": [
          {
            "id": "306",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 32
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "306"
      ],
      "defaultFinalId": "306",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 3,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 7,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 5,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 7,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "306",
      "pokedexId": 306,
      "name": "波士可多拉",
      "sourceNameZh": "波士可多拉",
      "nameEn": "Aggron",
      "specialty": "ingredient",
      "typeId": 17,
      "berryId": 17,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3000,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 28,
      "ingredientRate": 0.285,
      "skillRatePct": 5.2,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "304",
        "previous": {
          "id": "305",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "306"
      ],
      "defaultFinalId": "306",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 3,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 7,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 5,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 7,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "311",
      "pokedexId": 311,
      "name": "正电拍拍",
      "sourceNameZh": "正電拍拍",
      "nameEn": "Plusle",
      "specialty": "skill",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 16,
      "ingredientRate": 0.103,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "311",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "311"
      ],
      "defaultFinalId": "311",
      "mainSkill": {
        "id": 26,
        "name": "正电（食材获取S）",
        "nameEn": "Plus (Ingredient Magnet S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 17,
            "code": "A",
            "quantity": 1,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "30": [
          {
            "id": 17,
            "code": "A",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "60": [
          {
            "id": 17,
            "code": "A",
            "quantity": 4,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 3,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 8,
            "code": "C",
            "quantity": 6,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ]
      }
    },
    {
      "id": "312",
      "pokedexId": 312,
      "name": "负电拍拍",
      "sourceNameZh": "負電拍拍",
      "nameEn": "Minun",
      "specialty": "skill",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 16,
      "ingredientRate": 0.174,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "312",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "312"
      ],
      "defaultFinalId": "312",
      "mainSkill": {
        "id": 27,
        "name": "负电（料理强化S）",
        "nameEn": "Minus (Cooking Power-Up S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 1,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 8,
            "code": "C",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ]
      }
    },
    {
      "id": "316",
      "pokedexId": 316,
      "name": "溶食兽",
      "sourceNameZh": "溶食獸",
      "nameEn": "Gulpin",
      "specialty": "skill",
      "typeId": 8,
      "berryId": 8,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5900,
      "carryLimitBase": 8,
      "carryLimitRaisedFromFirstStage": 8,
      "ingredientRate": 0.214,
      "skillRatePct": 6.3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "316",
        "previous": null,
        "next": [
          {
            "id": "317",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 20
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "317"
      ],
      "defaultFinalId": "317",
      "mainSkill": {
        "id": 6,
        "name": "梦之碎片获取S（随机）",
        "nameEn": "Dream Shard Magnet S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 1,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "317",
      "pokedexId": 317,
      "name": "吞食兽",
      "sourceNameZh": "吞食獸",
      "nameEn": "Swalot",
      "specialty": "skill",
      "typeId": 8,
      "berryId": 8,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3500,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 24,
      "ingredientRate": 0.21,
      "skillRatePct": 7,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "316",
        "previous": {
          "id": "316",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "317"
      ],
      "defaultFinalId": "317",
      "mainSkill": {
        "id": 6,
        "name": "梦之碎片获取S（随机）",
        "nameEn": "Dream Shard Magnet S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 1,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "328",
      "pokedexId": 328,
      "name": "大颚蚁",
      "sourceNameZh": "大顎蟻",
      "nameEn": "Trapinch",
      "specialty": "ingredient",
      "typeId": 9,
      "berryId": 9,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5000,
      "carryLimitBase": 8,
      "carryLimitRaisedFromFirstStage": 8,
      "ingredientRate": 0.152,
      "skillRatePct": 3.1,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "328",
        "previous": null,
        "next": [
          {
            "id": "329",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 26
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "330"
      ],
      "defaultFinalId": "330",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 19,
            "code": "A",
            "quantity": 2,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          }
        ],
        "30": [
          {
            "id": 19,
            "code": "A",
            "quantity": 5,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 6,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "60": [
          {
            "id": 19,
            "code": "A",
            "quantity": 7,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 9,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 12,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "329",
      "pokedexId": 329,
      "name": "超音波幼虫",
      "sourceNameZh": "超音波幼蟲",
      "nameEn": "Vibrava",
      "specialty": "ingredient",
      "typeId": 9,
      "berryId": 9,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3700,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 17,
      "ingredientRate": 0.155,
      "skillRatePct": 3.4,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "328",
        "previous": {
          "id": "328",
          "conditions": []
        },
        "next": [
          {
            "id": "330",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 34
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "330"
      ],
      "defaultFinalId": "330",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 19,
            "code": "A",
            "quantity": 2,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          }
        ],
        "30": [
          {
            "id": 19,
            "code": "A",
            "quantity": 5,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 6,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "60": [
          {
            "id": 19,
            "code": "A",
            "quantity": 7,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 9,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 12,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "330",
      "pokedexId": 330,
      "name": "沙漠蜻蜓",
      "sourceNameZh": "沙漠蜻蜓",
      "nameEn": "Flygon",
      "specialty": "ingredient",
      "typeId": 9,
      "berryId": 9,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2700,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 27,
      "ingredientRate": 0.172,
      "skillRatePct": 3.9,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "328",
        "previous": {
          "id": "329",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "330"
      ],
      "defaultFinalId": "330",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 19,
            "code": "A",
            "quantity": 2,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          }
        ],
        "30": [
          {
            "id": 19,
            "code": "A",
            "quantity": 5,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 6,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "60": [
          {
            "id": 19,
            "code": "A",
            "quantity": 7,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 9,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 12,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "333",
      "pokedexId": 333,
      "name": "青绵鸟",
      "sourceNameZh": "青綿鳥",
      "nameEn": "Swablu",
      "specialty": "berry",
      "typeId": 10,
      "berryId": 10,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4200,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 12,
      "ingredientRate": 0.177,
      "skillRatePct": 3.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "333",
        "previous": null,
        "next": [
          {
            "id": "334",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 26
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "334"
      ],
      "defaultFinalId": "334",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 3,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 5,
            "code": "C",
            "quantity": 5,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ]
      }
    },
    {
      "id": "334",
      "pokedexId": 334,
      "name": "七夕青鸟",
      "sourceNameZh": "七夕青鳥",
      "nameEn": "Altaria",
      "specialty": "berry",
      "typeId": 15,
      "berryId": 15,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3500,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.258,
      "skillRatePct": 6.1,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "333",
        "previous": {
          "id": "333",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "334"
      ],
      "defaultFinalId": "334",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 3,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 5,
            "code": "C",
            "quantity": 5,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ]
      }
    },
    {
      "id": "353",
      "pokedexId": 353,
      "name": "怨影娃娃",
      "sourceNameZh": "怨影娃娃",
      "nameEn": "Shuppet",
      "specialty": "berry",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3900,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.171,
      "skillRatePct": 2.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "353",
        "previous": null,
        "next": [
          {
            "id": "354",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 28
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "354"
      ],
      "defaultFinalId": "354",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 3,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "354",
      "pokedexId": 354,
      "name": "诅咒娃娃",
      "sourceNameZh": "詛咒娃娃",
      "nameEn": "Banette",
      "specialty": "berry",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2600,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 24,
      "ingredientRate": 0.179,
      "skillRatePct": 3.3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "353",
        "previous": {
          "id": "353",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "354"
      ],
      "defaultFinalId": "354",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 3,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "359",
      "pokedexId": 359,
      "name": "阿勃梭鲁",
      "sourceNameZh": "阿勃梭魯",
      "nameEn": "Absol",
      "specialty": "ingredient",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2950,
      "carryLimitBase": 21,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.178,
      "skillRatePct": 3.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "359",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "359"
      ],
      "defaultFinalId": "359",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 5,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 8,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 7,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 12,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 7,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "360",
      "pokedexId": 360,
      "name": "小果然",
      "sourceNameZh": "小果然",
      "nameEn": "Wynaut",
      "specialty": "skill",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5800,
      "carryLimitBase": 7,
      "carryLimitRaisedFromFirstStage": 7,
      "ingredientRate": 0.213,
      "skillRatePct": 6.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "360",
        "previous": null,
        "next": [
          {
            "id": "202",
            "conditions": [
              {
                "type": "candy",
                "count": 20
              },
              {
                "type": "level",
                "level": 11
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "202"
      ],
      "defaultFinalId": "202",
      "mainSkill": {
        "id": 4,
        "name": "活力疗愈S",
        "nameEn": "Energizing Cheer S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "363",
      "pokedexId": 363,
      "name": "海豹球",
      "sourceNameZh": "海豹球",
      "nameEn": "Spheal",
      "specialty": "berry",
      "typeId": 6,
      "berryId": 6,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 5600,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.224,
      "skillRatePct": 2.3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "363",
        "previous": null,
        "next": [
          {
            "id": "364",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 24
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "365"
      ],
      "defaultFinalId": "365",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 11,
            "code": "C",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ]
      }
    },
    {
      "id": "364",
      "pokedexId": 364,
      "name": "海魔狮",
      "sourceNameZh": "海魔獅",
      "nameEn": "Sealeo",
      "specialty": "berry",
      "typeId": 6,
      "berryId": 6,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4000,
      "carryLimitBase": 13,
      "carryLimitRaisedFromFirstStage": 18,
      "ingredientRate": 0.221,
      "skillRatePct": 2.1,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "363",
        "previous": {
          "id": "363",
          "conditions": []
        },
        "next": [
          {
            "id": "365",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 33
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "365"
      ],
      "defaultFinalId": "365",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 11,
            "code": "C",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ]
      }
    },
    {
      "id": "365",
      "pokedexId": 365,
      "name": "帝牙海狮",
      "sourceNameZh": "帝牙海獅",
      "nameEn": "Walrein",
      "specialty": "berry",
      "typeId": 6,
      "berryId": 6,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3000,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 28,
      "ingredientRate": 0.223,
      "skillRatePct": 2.2,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "363",
        "previous": {
          "id": "364",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "365"
      ],
      "defaultFinalId": "365",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 11,
            "code": "C",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ]
      }
    },
    {
      "id": "371",
      "pokedexId": 371,
      "name": "宝贝龙",
      "sourceNameZh": "寶貝龍",
      "nameEn": "Bagon",
      "specialty": "berry",
      "typeId": 15,
      "berryId": 15,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 5300,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.209,
      "skillRatePct": 2.7,
      "expType": 2,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "371",
        "previous": null,
        "next": [
          {
            "id": "372",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 23
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "373"
      ],
      "defaultFinalId": "373",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 4,
            "code": "A",
            "quantity": 1,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "30": [
          {
            "id": 4,
            "code": "A",
            "quantity": 2,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 4,
            "code": "A",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "372",
      "pokedexId": 372,
      "name": "甲壳龙",
      "sourceNameZh": "甲殼龍",
      "nameEn": "Shelgon",
      "specialty": "berry",
      "typeId": 15,
      "berryId": 15,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3800,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.206,
      "skillRatePct": 2.7,
      "expType": 2,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "371",
        "previous": {
          "id": "371",
          "conditions": []
        },
        "next": [
          {
            "id": "373",
            "conditions": [
              {
                "type": "candy",
                "count": 100
              },
              {
                "type": "level",
                "level": 38
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "373"
      ],
      "defaultFinalId": "373",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 4,
            "code": "A",
            "quantity": 1,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "30": [
          {
            "id": 4,
            "code": "A",
            "quantity": 2,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 4,
            "code": "A",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "373",
      "pokedexId": 373,
      "name": "暴飞龙",
      "sourceNameZh": "暴飛龍",
      "nameEn": "Salamence",
      "specialty": "berry",
      "typeId": 15,
      "berryId": 15,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 22,
      "carryLimitRaisedFromFirstStage": 32,
      "ingredientRate": 0.217,
      "skillRatePct": 3.4,
      "expType": 2,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "371",
        "previous": {
          "id": "372",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "373"
      ],
      "defaultFinalId": "373",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 4,
            "code": "A",
            "quantity": 1,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "30": [
          {
            "id": 4,
            "code": "A",
            "quantity": 2,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 4,
            "code": "A",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "380",
      "pokedexId": 380,
      "name": "拉帝亚斯",
      "sourceNameZh": "拉帝亞斯",
      "nameEn": "Latias",
      "specialty": "skill",
      "typeId": 15,
      "berryId": 15,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.114,
      "skillRatePct": 4.9,
      "expType": 3,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "380",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "380"
      ],
      "defaultFinalId": "380",
      "mainSkill": {
        "id": 34,
        "name": "治愈波动（活力疗愈S）",
        "nameEn": "Heal Pulse (Energizing Cheer S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 1,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 18,
            "code": "B",
            "quantity": 1,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 18,
            "code": "B",
            "quantity": 2,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "381",
      "pokedexId": 381,
      "name": "拉帝欧斯",
      "sourceNameZh": "拉帝歐斯",
      "nameEn": "Latios",
      "specialty": "skill",
      "typeId": 15,
      "berryId": 15,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.198,
      "skillRatePct": 3,
      "expType": 3,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "381",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "381"
      ],
      "defaultFinalId": "381",
      "mainSkill": {
        "id": 35,
        "name": "流星群（树果骤增）",
        "nameEn": "Draco Meteor (Berry Burst)"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 1,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 8,
            "code": "C",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ]
      }
    },
    {
      "id": "387",
      "pokedexId": 387,
      "name": "草苗龟",
      "sourceNameZh": "草苗龜",
      "nameEn": "Turtwig",
      "specialty": "skill",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4500,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 12,
      "ingredientRate": 0.132,
      "skillRatePct": 4.1,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "387",
        "previous": null,
        "next": [
          {
            "id": "388",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 14
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "389"
      ],
      "defaultFinalId": "389",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 2,
            "code": "A",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "30": [
          {
            "id": 2,
            "code": "A",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 2,
            "code": "A",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 5,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 11,
            "code": "C",
            "quantity": 6,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ]
      }
    },
    {
      "id": "388",
      "pokedexId": 388,
      "name": "树林龟",
      "sourceNameZh": "樹林龜",
      "nameEn": "Grotle",
      "specialty": "skill",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3700,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.15,
      "skillRatePct": 4.6,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "387",
        "previous": {
          "id": "387",
          "conditions": []
        },
        "next": [
          {
            "id": "389",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 24
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "389"
      ],
      "defaultFinalId": "389",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 2,
            "code": "A",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "30": [
          {
            "id": 2,
            "code": "A",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 2,
            "code": "A",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 5,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 11,
            "code": "C",
            "quantity": 6,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ]
      }
    },
    {
      "id": "389",
      "pokedexId": 389,
      "name": "土台龟",
      "sourceNameZh": "土台龜",
      "nameEn": "Torterra",
      "specialty": "skill",
      "typeId": 9,
      "berryId": 9,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2900,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 27,
      "ingredientRate": 0.156,
      "skillRatePct": 4.8,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "387",
        "previous": {
          "id": "388",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "389"
      ],
      "defaultFinalId": "389",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 2,
            "code": "A",
            "quantity": 1,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "30": [
          {
            "id": 2,
            "code": "A",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 2,
            "code": "A",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 5,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 11,
            "code": "C",
            "quantity": 6,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ]
      }
    },
    {
      "id": "390",
      "pokedexId": 390,
      "name": "小火焰猴",
      "sourceNameZh": "小火焰猴",
      "nameEn": "Chimchar",
      "specialty": "skill",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4100,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.114,
      "skillRatePct": 3.3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "390",
        "previous": null,
        "next": [
          {
            "id": "391",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 11
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "392"
      ],
      "defaultFinalId": "392",
      "mainSkill": {
        "id": 21,
        "name": "树果骤增",
        "nameEn": "Berry Burst"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 1,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 17,
            "code": "C",
            "quantity": 3,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ]
      }
    },
    {
      "id": "391",
      "pokedexId": 391,
      "name": "猛火猴",
      "sourceNameZh": "猛火猴",
      "nameEn": "Monferno",
      "specialty": "skill",
      "typeId": 7,
      "berryId": 7,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3100,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.114,
      "skillRatePct": 3.3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "390",
        "previous": {
          "id": "390",
          "conditions": []
        },
        "next": [
          {
            "id": "392",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 27
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "392"
      ],
      "defaultFinalId": "392",
      "mainSkill": {
        "id": 21,
        "name": "树果骤增",
        "nameEn": "Berry Burst"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 1,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 17,
            "code": "C",
            "quantity": 3,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ]
      }
    },
    {
      "id": "392",
      "pokedexId": 392,
      "name": "烈焰猴",
      "sourceNameZh": "烈焰猴",
      "nameEn": "Infernape",
      "specialty": "skill",
      "typeId": 7,
      "berryId": 7,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 28,
      "ingredientRate": 0.106,
      "skillRatePct": 3.3,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "390",
        "previous": {
          "id": "391",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "392"
      ],
      "defaultFinalId": "392",
      "mainSkill": {
        "id": 21,
        "name": "树果骤增",
        "nameEn": "Berry Burst"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 1,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 17,
            "code": "C",
            "quantity": 3,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ]
      }
    },
    {
      "id": "393",
      "pokedexId": 393,
      "name": "波加曼",
      "sourceNameZh": "波加曼",
      "nameEn": "Piplup",
      "specialty": "berry",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4500,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.159,
      "skillRatePct": 2.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "393",
        "previous": null,
        "next": [
          {
            "id": "394",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "395"
      ],
      "defaultFinalId": "395",
      "mainSkill": {
        "id": 9,
        "name": "帮手支援S",
        "nameEn": "Extra Helpful S"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 1,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "394",
      "pokedexId": 394,
      "name": "波皇子",
      "sourceNameZh": "波皇子",
      "nameEn": "Prinplup",
      "specialty": "berry",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3700,
      "carryLimitBase": 15,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.163,
      "skillRatePct": 3.5,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "393",
        "previous": {
          "id": "393",
          "conditions": []
        },
        "next": [
          {
            "id": "395",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 27
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "395"
      ],
      "defaultFinalId": "395",
      "mainSkill": {
        "id": 9,
        "name": "帮手支援S",
        "nameEn": "Extra Helpful S"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 1,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "395",
      "pokedexId": 395,
      "name": "帝王拿波",
      "sourceNameZh": "帝王拿波",
      "nameEn": "Empoleon",
      "specialty": "berry",
      "typeId": 17,
      "berryId": 17,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3200,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 28,
      "ingredientRate": 0.168,
      "skillRatePct": 3.8,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "393",
        "previous": {
          "id": "394",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "395"
      ],
      "defaultFinalId": "395",
      "mainSkill": {
        "id": 9,
        "name": "帮手支援S",
        "nameEn": "Extra Helpful S"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 1,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "403",
      "pokedexId": 403,
      "name": "小猫怪",
      "sourceNameZh": "小貓怪",
      "nameEn": "Shinx",
      "specialty": "ingredient",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4400,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.181,
      "skillRatePct": 1.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "403",
        "previous": null,
        "next": [
          {
            "id": "404",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 11
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "405"
      ],
      "defaultFinalId": "405",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 7,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 17,
            "code": "C",
            "quantity": 5,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ]
      }
    },
    {
      "id": "404",
      "pokedexId": 404,
      "name": "勒克猫",
      "sourceNameZh": "勒克貓",
      "nameEn": "Luxio",
      "specialty": "ingredient",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3200,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.182,
      "skillRatePct": 1.8,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "403",
        "previous": {
          "id": "403",
          "conditions": []
        },
        "next": [
          {
            "id": "405",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 23
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "405"
      ],
      "defaultFinalId": "405",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 7,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 17,
            "code": "C",
            "quantity": 5,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ]
      }
    },
    {
      "id": "405",
      "pokedexId": 405,
      "name": "伦琴猫",
      "sourceNameZh": "倫琴貓",
      "nameEn": "Luxray",
      "specialty": "ingredient",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 21,
      "carryLimitRaisedFromFirstStage": 31,
      "ingredientRate": 0.2,
      "skillRatePct": 2.3,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "403",
        "previous": {
          "id": "404",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "405"
      ],
      "defaultFinalId": "405",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 7,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 17,
            "code": "C",
            "quantity": 5,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ]
      }
    },
    {
      "id": "425",
      "pokedexId": 425,
      "name": "飘飘球",
      "sourceNameZh": "飄飄球",
      "nameEn": "Drifloon",
      "specialty": "skill",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4800,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.137,
      "skillRatePct": 7.1,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "425",
        "previous": null,
        "next": [
          {
            "id": "426",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 21
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "426"
      ],
      "defaultFinalId": "426",
      "mainSkill": {
        "id": 16,
        "name": "蓄力（能量填充S）",
        "nameEn": "Stockpile (Charge Strength S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 16,
            "code": "A",
            "quantity": 1,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "30": [
          {
            "id": 16,
            "code": "A",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 16,
            "code": "A",
            "quantity": 4,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "426",
      "pokedexId": 426,
      "name": "随风球",
      "sourceNameZh": "隨風球",
      "nameEn": "Drifblim",
      "specialty": "skill",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 22,
      "ingredientRate": 0.128,
      "skillRatePct": 6.3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "425",
        "previous": {
          "id": "425",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "426"
      ],
      "defaultFinalId": "426",
      "mainSkill": {
        "id": 16,
        "name": "蓄力（能量填充S）",
        "nameEn": "Stockpile (Charge Strength S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 16,
            "code": "A",
            "quantity": 1,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "30": [
          {
            "id": 16,
            "code": "A",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 3,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 16,
            "code": "A",
            "quantity": 4,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "430",
      "pokedexId": 430,
      "name": "乌鸦头头",
      "sourceNameZh": "烏鴉頭頭",
      "nameEn": "Honchkrow",
      "specialty": "skill",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3200,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 23,
      "ingredientRate": 0.143,
      "skillRatePct": 6.7,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "198",
        "previous": {
          "id": "198",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "430"
      ],
      "defaultFinalId": "430",
      "mainSkill": {
        "id": 24,
        "name": "超幸运（食材精选S）",
        "nameEn": "Super Luck (Ingredient Draw S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 17,
            "code": "A",
            "quantity": 1,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "30": [
          {
            "id": 17,
            "code": "A",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 3,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 17,
            "code": "A",
            "quantity": 4,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 6,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 6,
            "code": "C",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "438",
      "pokedexId": 438,
      "name": "盆才怪",
      "sourceNameZh": "盆才怪",
      "nameEn": "Bonsly",
      "specialty": "skill",
      "typeId": 13,
      "berryId": 13,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 6300,
      "carryLimitBase": 8,
      "carryLimitRaisedFromFirstStage": 8,
      "ingredientRate": 0.189,
      "skillRatePct": 6.1,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "438",
        "previous": null,
        "next": [
          {
            "id": "185",
            "conditions": [
              {
                "type": "candy",
                "count": 20
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "185"
      ],
      "defaultFinalId": "185",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 1,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "439",
      "pokedexId": 439,
      "name": "魔尼尼",
      "sourceNameZh": "魔尼尼",
      "nameEn": "Mime Jr.",
      "specialty": "ingredient",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4300,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.201,
      "skillRatePct": 3.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "439",
        "previous": null,
        "next": [
          {
            "id": "122",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "122"
      ],
      "defaultFinalId": "122",
      "mainSkill": {
        "id": 20,
        "name": "模仿（技能复制）",
        "nameEn": "Mimic (Skill Copy)"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 6,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 4,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "440",
      "pokedexId": 440,
      "name": "小福蛋",
      "sourceNameZh": "小福蛋",
      "nameEn": "Happiny",
      "specialty": "ingredient",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5400,
      "carryLimitBase": 7,
      "carryLimitRaisedFromFirstStage": 7,
      "ingredientRate": 0.21,
      "skillRatePct": 1.3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "440",
        "previous": null,
        "next": [
          {
            "id": "113",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 30,
                "count": 1
              },
              {
                "type": "timing",
                "startHour": 6,
                "endHour": 18
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "242"
      ],
      "defaultFinalId": "242",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 5,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 7,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 7,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 8,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "442",
      "pokedexId": 442,
      "name": "花岩怪",
      "sourceNameZh": "花岩怪",
      "nameEn": "Spiritomb",
      "specialty": "ingredient",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3500,
      "carryLimitBase": 27,
      "carryLimitRaisedFromFirstStage": 27,
      "ingredientRate": 0.198,
      "skillRatePct": 3.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "442",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "442"
      ],
      "defaultFinalId": "442",
      "mainSkill": {
        "id": 9,
        "name": "帮手支援S",
        "nameEn": "Extra Helpful S"
      },
      "ingredients": {
        "1": [
          {
            "id": 2,
            "code": "A",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "30": [
          {
            "id": 2,
            "code": "A",
            "quantity": 5,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 18,
            "code": "B",
            "quantity": 3,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "60": [
          {
            "id": 2,
            "code": "A",
            "quantity": 7,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 18,
            "code": "B",
            "quantity": 5,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 6,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "447",
      "pokedexId": 447,
      "name": "利欧路",
      "sourceNameZh": "利歐路",
      "nameEn": "Riolu",
      "specialty": "skill",
      "typeId": 7,
      "berryId": 7,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4200,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.126,
      "skillRatePct": 3.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "447",
        "previous": null,
        "next": [
          {
            "id": "448",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "sleepTime",
                "hours": 150
              },
              {
                "type": "timing",
                "startHour": 6,
                "endHour": 18
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "448"
      ],
      "defaultFinalId": "448",
      "mainSkill": {
        "id": 3,
        "name": "梦之碎片获取S",
        "nameEn": "Dream Shard Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 2,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "448",
      "pokedexId": 448,
      "name": "路卡利欧",
      "sourceNameZh": "路卡利歐",
      "nameEn": "Lucario",
      "specialty": "skill",
      "typeId": 7,
      "berryId": 7,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2600,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.15,
      "skillRatePct": 5.1,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "447",
        "previous": {
          "id": "447",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "448"
      ],
      "defaultFinalId": "448",
      "mainSkill": {
        "id": 36,
        "name": "波导弹（梦之碎片获取S）",
        "nameEn": "Aura Sphere (Dream Shard Magnet S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 2,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "453",
      "pokedexId": 453,
      "name": "不良蛙",
      "sourceNameZh": "不良蛙",
      "nameEn": "Croagunk",
      "specialty": "ingredient",
      "typeId": 8,
      "berryId": 8,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5600,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.228,
      "skillRatePct": 4.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "453",
        "previous": null,
        "next": [
          {
            "id": "454",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 28
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "454"
      ],
      "defaultFinalId": "454",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 5,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 7,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 8,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "454",
      "pokedexId": 454,
      "name": "毒骷蛙",
      "sourceNameZh": "毒骷蛙",
      "nameEn": "Toxicroak",
      "specialty": "ingredient",
      "typeId": 8,
      "berryId": 8,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3400,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.229,
      "skillRatePct": 4.3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "453",
        "previous": {
          "id": "453",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "454"
      ],
      "defaultFinalId": "454",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 5,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 7,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 8,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "459",
      "pokedexId": 459,
      "name": "雪笠怪",
      "sourceNameZh": "雪笠怪",
      "nameEn": "Snover",
      "specialty": "ingredient",
      "typeId": 6,
      "berryId": 6,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5600,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.251,
      "skillRatePct": 4.4,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "459",
        "previous": null,
        "next": [
          {
            "id": "460",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 30
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "460"
      ],
      "defaultFinalId": "460",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 7,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 5,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "460",
      "pokedexId": 460,
      "name": "暴雪王",
      "sourceNameZh": "暴雪王",
      "nameEn": "Abomasnow",
      "specialty": "ingredient",
      "typeId": 6,
      "berryId": 6,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3000,
      "carryLimitBase": 21,
      "carryLimitRaisedFromFirstStage": 26,
      "ingredientRate": 0.25,
      "skillRatePct": 4.4,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "459",
        "previous": {
          "id": "459",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "460"
      ],
      "defaultFinalId": "460",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 5,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 7,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 7,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 5,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "461",
      "pokedexId": 461,
      "name": "玛狃拉",
      "sourceNameZh": "瑪狃拉",
      "nameEn": "Weavile",
      "specialty": "berry",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2700,
      "carryLimitBase": 21,
      "carryLimitRaisedFromFirstStage": 26,
      "ingredientRate": 0.251,
      "skillRatePct": 1.8,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "215",
        "previous": {
          "id": "215",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "461"
      ],
      "defaultFinalId": "461",
      "mainSkill": {
        "id": 14,
        "name": "料理成功S",
        "nameEn": "Tasty Chance S"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 3,
            "code": "B",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 15,
            "code": "C",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ]
      }
    },
    {
      "id": "462",
      "pokedexId": 462,
      "name": "自爆磁怪",
      "sourceNameZh": "自爆磁怪",
      "nameEn": "Magnezone",
      "specialty": "skill",
      "typeId": 17,
      "berryId": 17,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3100,
      "carryLimitBase": 13,
      "carryLimitRaisedFromFirstStage": 23,
      "ingredientRate": 0.179,
      "skillRatePct": 6.2,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "81",
        "previous": {
          "id": "82",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "462"
      ],
      "defaultFinalId": "462",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 3,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "468",
      "pokedexId": 468,
      "name": "波克基斯",
      "sourceNameZh": "波克基斯",
      "nameEn": "Togekiss",
      "specialty": "skill",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2600,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 26,
      "ingredientRate": 0.158,
      "skillRatePct": 5.3,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "175",
        "previous": {
          "id": "176",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "468"
      ],
      "defaultFinalId": "468",
      "mainSkill": {
        "id": 13,
        "name": "挥指",
        "nameEn": "Metronome"
      },
      "ingredients": {
        "1": [
          {
            "id": 3,
            "code": "A",
            "quantity": 1,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ],
        "30": [
          {
            "id": 3,
            "code": "A",
            "quantity": 2,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 3,
            "code": "A",
            "quantity": 4,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 13,
            "code": "C",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ]
      }
    },
    {
      "id": "470",
      "pokedexId": 470,
      "name": "叶伊布",
      "sourceNameZh": "葉伊布",
      "nameEn": "Leafeon",
      "specialty": "skill",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3000,
      "carryLimitBase": 13,
      "carryLimitRaisedFromFirstStage": 18,
      "ingredientRate": 0.205,
      "skillRatePct": 6.9,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "133",
        "previous": {
          "id": "133",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "470"
      ],
      "defaultFinalId": "470",
      "mainSkill": {
        "id": 4,
        "name": "活力疗愈S",
        "nameEn": "Energizing Cheer S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "471",
      "pokedexId": 471,
      "name": "冰伊布",
      "sourceNameZh": "冰伊布",
      "nameEn": "Glaceon",
      "specialty": "skill",
      "typeId": 6,
      "berryId": 6,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3200,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 17,
      "ingredientRate": 0.219,
      "skillRatePct": 6.3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "133",
        "previous": {
          "id": "133",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "471"
      ],
      "defaultFinalId": "471",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "475",
      "pokedexId": 475,
      "name": "艾路雷朵",
      "sourceNameZh": "艾路雷朵",
      "nameEn": "Gallade",
      "specialty": "skill",
      "typeId": 7,
      "berryId": 7,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 29,
      "ingredientRate": 0.147,
      "skillRatePct": 5.4,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "280",
        "previous": {
          "id": "281",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "475"
      ],
      "defaultFinalId": "475",
      "mainSkill": {
        "id": 9,
        "name": "帮手支援S",
        "nameEn": "Extra Helpful S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 1,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "488",
      "pokedexId": 488,
      "name": "克雷色利亚",
      "sourceNameZh": "克雷色利亞",
      "nameEn": "Cresselia",
      "specialty": "skill",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2300,
      "carryLimitBase": 22,
      "carryLimitRaisedFromFirstStage": 22,
      "ingredientRate": 0.239,
      "skillRatePct": 4.1,
      "expType": 3,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "488",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "488"
      ],
      "defaultFinalId": "488",
      "mainSkill": {
        "id": 22,
        "name": "新月祈祷（活力全体疗愈S）",
        "nameEn": "Crescent Prayer (Energy for Everyone S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 11,
            "code": "A",
            "quantity": 1,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "30": [
          {
            "id": 11,
            "code": "A",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 11,
            "code": "A",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 12,
            "code": "C",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ]
      }
    },
    {
      "id": "491",
      "pokedexId": 491,
      "name": "达克莱伊",
      "sourceNameZh": "達克萊伊",
      "nameEn": "Darkrai",
      "specialty": "all",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2900,
      "carryLimitBase": 28,
      "carryLimitRaisedFromFirstStage": 28,
      "ingredientRate": 0.192,
      "skillRatePct": 2.3,
      "expType": 4,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "491",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "491"
      ],
      "defaultFinalId": "491",
      "mainSkill": {
        "id": 23,
        "name": "噩梦（能量填充M）",
        "nameEn": "Nightmare (Charge Strength M)"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "?",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 9,
            "code": "?",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 15,
            "code": "?",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 16,
            "code": "?",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 17,
            "code": "?",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "?",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 9,
            "code": "?",
            "quantity": 4,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 15,
            "code": "?",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 16,
            "code": "?",
            "quantity": 3,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 17,
            "code": "?",
            "quantity": 3,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 5,
            "code": "A",
            "quantity": 5,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 3,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "?",
            "quantity": 6,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 9,
            "code": "?",
            "quantity": 6,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 15,
            "code": "?",
            "quantity": 6,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 16,
            "code": "?",
            "quantity": 4,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 17,
            "code": "?",
            "quantity": 4,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 5,
            "code": "A",
            "quantity": 7,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 6,
            "code": "B",
            "quantity": 5,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 6,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "517",
      "pokedexId": 517,
      "name": "食梦梦",
      "sourceNameZh": "食夢夢",
      "nameEn": "Munna",
      "specialty": "berry",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 5700,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 12,
      "ingredientRate": 0.197,
      "skillRatePct": 4.3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "517",
        "previous": null,
        "next": [
          {
            "id": "518",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 27,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "518"
      ],
      "defaultFinalId": "518",
      "mainSkill": {
        "id": 6,
        "name": "梦之碎片获取S（随机）",
        "nameEn": "Dream Shard Magnet S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 3,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 17,
            "code": "C",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ]
      }
    },
    {
      "id": "518",
      "pokedexId": 518,
      "name": "梦梦蚀",
      "sourceNameZh": "夢夢蝕",
      "nameEn": "Musharna",
      "specialty": "berry",
      "typeId": 11,
      "berryId": 11,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 24,
      "carryLimitRaisedFromFirstStage": 29,
      "ingredientRate": 0.188,
      "skillRatePct": 4.1,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "517",
        "previous": {
          "id": "517",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "518"
      ],
      "defaultFinalId": "518",
      "mainSkill": {
        "id": 6,
        "name": "梦之碎片获取S（随机）",
        "nameEn": "Dream Shard Magnet S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 9,
            "code": "B",
            "quantity": 3,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 17,
            "code": "C",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ]
      }
    },
    {
      "id": "557",
      "pokedexId": 557,
      "name": "石居蟹",
      "sourceNameZh": "石居蟹",
      "nameEn": "Dwebble",
      "specialty": "skill",
      "typeId": 12,
      "berryId": 12,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4300,
      "carryLimitBase": 8,
      "carryLimitRaisedFromFirstStage": 8,
      "ingredientRate": 0.175,
      "skillRatePct": 5.4,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "557",
        "previous": null,
        "next": [
          {
            "id": "558",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 26
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "558"
      ],
      "defaultFinalId": "558",
      "mainSkill": {
        "id": 28,
        "name": "食材精选S",
        "nameEn": "Ingredient Draw S"
      },
      "ingredients": {
        "1": [
          {
            "id": 19,
            "code": "A",
            "quantity": 1,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          }
        ],
        "30": [
          {
            "id": 19,
            "code": "A",
            "quantity": 2,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 19,
            "code": "A",
            "quantity": 4,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 5,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 5,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "558",
      "pokedexId": 558,
      "name": "岩殿居蟹",
      "sourceNameZh": "岩殿居蟹",
      "nameEn": "Crustle",
      "specialty": "skill",
      "typeId": 12,
      "berryId": 12,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3200,
      "carryLimitBase": 17,
      "carryLimitRaisedFromFirstStage": 22,
      "ingredientRate": 0.239,
      "skillRatePct": 6.4,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "557",
        "previous": {
          "id": "557",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "558"
      ],
      "defaultFinalId": "558",
      "mainSkill": {
        "id": 28,
        "name": "食材精选S",
        "nameEn": "Ingredient Draw S"
      },
      "ingredients": {
        "1": [
          {
            "id": 19,
            "code": "A",
            "quantity": 1,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          }
        ],
        "30": [
          {
            "id": 19,
            "code": "A",
            "quantity": 2,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 19,
            "code": "A",
            "quantity": 4,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 5,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 5,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "627",
      "pokedexId": 627,
      "name": "毛头小鹰",
      "sourceNameZh": "毛頭小鷹",
      "nameEn": "Rufflet",
      "specialty": "skill",
      "typeId": 10,
      "berryId": 10,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3800,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.125,
      "skillRatePct": 3.1,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "627",
        "previous": null,
        "next": [
          {
            "id": "628",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 41
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "628"
      ],
      "defaultFinalId": "628",
      "mainSkill": {
        "id": 21,
        "name": "树果骤增",
        "nameEn": "Berry Burst"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 3,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 17,
            "code": "C",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ]
      }
    },
    {
      "id": "628",
      "pokedexId": 628,
      "name": "勇士雄鹰",
      "sourceNameZh": "勇士雄鷹",
      "nameEn": "Braviary",
      "specialty": "skill",
      "typeId": 10,
      "berryId": 10,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 23,
      "ingredientRate": 0.121,
      "skillRatePct": 3.5,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "627",
        "previous": {
          "id": "627",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "628"
      ],
      "defaultFinalId": "628",
      "mainSkill": {
        "id": 21,
        "name": "树果骤增",
        "nameEn": "Berry Burst"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 3,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 17,
            "code": "C",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ]
      }
    },
    {
      "id": "696",
      "pokedexId": 696,
      "name": "宝宝暴龙",
      "sourceNameZh": "寶寶暴龍",
      "nameEn": "Tyrunt",
      "specialty": "berry",
      "typeId": 13,
      "berryId": 13,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 5200,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.203,
      "skillRatePct": 2.4,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "696",
        "previous": null,
        "next": [
          {
            "id": "697",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 29
              },
              {
                "type": "timing",
                "startHour": 6,
                "endHour": 18
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "697"
      ],
      "defaultFinalId": "697",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 3,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "697",
      "pokedexId": 697,
      "name": "怪颚龙",
      "sourceNameZh": "怪顎龍",
      "nameEn": "Tyrantrum",
      "specialty": "berry",
      "typeId": 13,
      "berryId": 13,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 23,
      "carryLimitRaisedFromFirstStage": 28,
      "ingredientRate": 0.178,
      "skillRatePct": 2.9,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "696",
        "previous": {
          "id": "696",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "697"
      ],
      "defaultFinalId": "697",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 7,
            "code": "A",
            "quantity": 1,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "30": [
          {
            "id": 7,
            "code": "A",
            "quantity": 2,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 3,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "60": [
          {
            "id": 7,
            "code": "A",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "700",
      "pokedexId": 700,
      "name": "仙子伊布",
      "sourceNameZh": "仙子伊布",
      "nameEn": "Sylveon",
      "specialty": "skill",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2600,
      "carryLimitBase": 15,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.178,
      "skillRatePct": 4,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "133",
        "previous": {
          "id": "133",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "700"
      ],
      "defaultFinalId": "700",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "701",
      "pokedexId": 701,
      "name": "摔角鹰人",
      "sourceNameZh": "摔角鷹人",
      "nameEn": "Hawlucha",
      "specialty": "skill",
      "typeId": 10,
      "berryId": 10,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 21,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.192,
      "skillRatePct": 5.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "701",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "701"
      ],
      "defaultFinalId": "701",
      "mainSkill": {
        "id": 28,
        "name": "食材精选S",
        "nameEn": "Ingredient Draw S"
      },
      "ingredients": {
        "1": [
          {
            "id": 6,
            "code": "A",
            "quantity": 1,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ],
        "30": [
          {
            "id": 6,
            "code": "A",
            "quantity": 2,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 6,
            "code": "A",
            "quantity": 4,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "702",
      "pokedexId": 702,
      "name": "咚咚鼠",
      "sourceNameZh": "咚咚鼠",
      "nameEn": "Dedenne",
      "specialty": "skill",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.177,
      "skillRatePct": 4.5,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "702",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "702"
      ],
      "defaultFinalId": "702",
      "mainSkill": {
        "id": 14,
        "name": "料理成功S",
        "nameEn": "Tasty Chance S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 16,
            "code": "C",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ]
      }
    },
    {
      "id": "710-1",
      "pokedexId": 710,
      "name": "南瓜精",
      "sourceNameZh": "南瓜精",
      "nameEn": "Pumpkaboo",
      "specialty": "ingredient",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5400,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.12,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "710",
        "previous": null,
        "next": [
          {
            "id": "711-1",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 21,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "711-1"
      ],
      "defaultFinalId": "711-1",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 18,
            "code": "A",
            "quantity": 2,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "30": [
          {
            "id": 18,
            "code": "A",
            "quantity": 5,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 11,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 18,
            "code": "A",
            "quantity": 7,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 18,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 15,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "710-2",
      "pokedexId": 710,
      "name": "南瓜精",
      "sourceNameZh": "南瓜精",
      "nameEn": "Pumpkaboo",
      "specialty": "ingredient",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5300,
      "carryLimitBase": 7,
      "carryLimitRaisedFromFirstStage": 7,
      "ingredientRate": 0.12,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "710",
        "previous": null,
        "next": [
          {
            "id": "711-2",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 21,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "711-2"
      ],
      "defaultFinalId": "711-2",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 18,
            "code": "A",
            "quantity": 2,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "30": [
          {
            "id": 18,
            "code": "A",
            "quantity": 5,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 11,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 18,
            "code": "A",
            "quantity": 7,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 18,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 15,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "710-3",
      "pokedexId": 710,
      "name": "南瓜精",
      "sourceNameZh": "南瓜精",
      "nameEn": "Pumpkaboo",
      "specialty": "ingredient",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5500,
      "carryLimitBase": 15,
      "carryLimitRaisedFromFirstStage": 15,
      "ingredientRate": 0.12,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "710",
        "previous": null,
        "next": [
          {
            "id": "711-3",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 21,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "711-3"
      ],
      "defaultFinalId": "711-3",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 18,
            "code": "A",
            "quantity": 2,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "30": [
          {
            "id": 18,
            "code": "A",
            "quantity": 5,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 11,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 18,
            "code": "A",
            "quantity": 7,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 18,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 15,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "710-4",
      "pokedexId": 710,
      "name": "南瓜精",
      "sourceNameZh": "南瓜精",
      "nameEn": "Pumpkaboo",
      "specialty": "ingredient",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5600,
      "carryLimitBase": 21,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.12,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "710",
        "previous": null,
        "next": [
          {
            "id": "711-4",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 21,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "711-4"
      ],
      "defaultFinalId": "711-4",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 18,
            "code": "A",
            "quantity": 2,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "30": [
          {
            "id": 18,
            "code": "A",
            "quantity": 5,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 11,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 18,
            "code": "A",
            "quantity": 7,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 18,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 15,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "711-1",
      "pokedexId": 711,
      "name": "南瓜怪人",
      "sourceNameZh": "南瓜怪人",
      "nameEn": "Gourgeist",
      "specialty": "ingredient",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3200,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.13,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "710",
        "previous": {
          "id": "710-1",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "711-1"
      ],
      "defaultFinalId": "711-1",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 18,
            "code": "A",
            "quantity": 2,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "30": [
          {
            "id": 18,
            "code": "A",
            "quantity": 5,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 11,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 18,
            "code": "A",
            "quantity": 7,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 18,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 15,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "711-2",
      "pokedexId": 711,
      "name": "南瓜怪人",
      "sourceNameZh": "南瓜怪人",
      "nameEn": "Gourgeist",
      "specialty": "ingredient",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3100,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 15,
      "ingredientRate": 0.13,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "710",
        "previous": {
          "id": "710-2",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "711-2"
      ],
      "defaultFinalId": "711-2",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 18,
            "code": "A",
            "quantity": 2,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "30": [
          {
            "id": 18,
            "code": "A",
            "quantity": 5,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 11,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 18,
            "code": "A",
            "quantity": 7,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 18,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 15,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "711-3",
      "pokedexId": 711,
      "name": "南瓜怪人",
      "sourceNameZh": "南瓜怪人",
      "nameEn": "Gourgeist",
      "specialty": "ingredient",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3300,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 24,
      "ingredientRate": 0.13,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "710",
        "previous": {
          "id": "710-3",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "711-3"
      ],
      "defaultFinalId": "711-3",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 18,
            "code": "A",
            "quantity": 2,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "30": [
          {
            "id": 18,
            "code": "A",
            "quantity": 5,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 11,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 18,
            "code": "A",
            "quantity": 7,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 18,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 15,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "711-4",
      "pokedexId": 711,
      "name": "南瓜怪人",
      "sourceNameZh": "南瓜怪人",
      "nameEn": "Gourgeist",
      "specialty": "ingredient",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3400,
      "carryLimitBase": 25,
      "carryLimitRaisedFromFirstStage": 30,
      "ingredientRate": 0.13,
      "skillRatePct": 4.9,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "710",
        "previous": {
          "id": "710-4",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "711-4"
      ],
      "defaultFinalId": "711-4",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 18,
            "code": "A",
            "quantity": 2,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "30": [
          {
            "id": 18,
            "code": "A",
            "quantity": 5,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 11,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "60": [
          {
            "id": 18,
            "code": "A",
            "quantity": 7,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 15,
            "code": "B",
            "quantity": 18,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 15,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "714",
      "pokedexId": 714,
      "name": "嗡蝠",
      "sourceNameZh": "嗡蝠",
      "nameEn": "Noibat",
      "specialty": "skill",
      "typeId": 15,
      "berryId": 15,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5100,
      "carryLimitBase": 7,
      "carryLimitRaisedFromFirstStage": 7,
      "ingredientRate": 0.198,
      "skillRatePct": 4.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "714",
        "previous": null,
        "next": [
          {
            "id": "715",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 36
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "715"
      ],
      "defaultFinalId": "715",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 1,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "715",
      "pokedexId": 715,
      "name": "音波龙",
      "sourceNameZh": "音波龍",
      "nameEn": "Noivern",
      "specialty": "skill",
      "typeId": 15,
      "berryId": 15,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2700,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 23,
      "ingredientRate": 0.195,
      "skillRatePct": 4.8,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "714",
        "previous": {
          "id": "714",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "715"
      ],
      "defaultFinalId": "715",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 1,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "736",
      "pokedexId": 736,
      "name": "强颚鸡母虫",
      "sourceNameZh": "強顎雞母蟲",
      "nameEn": "Grubbin",
      "specialty": "ingredient",
      "typeId": 12,
      "berryId": 12,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4600,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.155,
      "skillRatePct": 2.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "736",
        "previous": null,
        "next": [
          {
            "id": "737",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 15
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "738"
      ],
      "defaultFinalId": "738",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 17,
            "code": "A",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "30": [
          {
            "id": 17,
            "code": "A",
            "quantity": 5,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 17,
            "code": "A",
            "quantity": 7,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 7,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 11,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "737",
      "pokedexId": 737,
      "name": "虫电宝",
      "sourceNameZh": "蟲電寶",
      "nameEn": "Charjabug",
      "specialty": "ingredient",
      "typeId": 12,
      "berryId": 12,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3300,
      "carryLimitBase": 15,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.154,
      "skillRatePct": 2.8,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "736",
        "previous": {
          "id": "736",
          "conditions": []
        },
        "next": [
          {
            "id": "738",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 24,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "738"
      ],
      "defaultFinalId": "738",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 17,
            "code": "A",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "30": [
          {
            "id": 17,
            "code": "A",
            "quantity": 5,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 17,
            "code": "A",
            "quantity": 7,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 7,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 11,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "738",
      "pokedexId": 738,
      "name": "锹农炮虫",
      "sourceNameZh": "鍬農炮蟲",
      "nameEn": "Vikavolt",
      "specialty": "ingredient",
      "typeId": 12,
      "berryId": 12,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 29,
      "ingredientRate": 0.194,
      "skillRatePct": 5.1,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "736",
        "previous": {
          "id": "737",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "738"
      ],
      "defaultFinalId": "738",
      "mainSkill": {
        "id": 1,
        "name": "能量填充S",
        "nameEn": "Charge Strength S"
      },
      "ingredients": {
        "1": [
          {
            "id": 17,
            "code": "A",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "30": [
          {
            "id": 17,
            "code": "A",
            "quantity": 5,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 4,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ],
        "60": [
          {
            "id": 17,
            "code": "A",
            "quantity": 7,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 2,
            "code": "B",
            "quantity": 7,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          },
          {
            "id": 9,
            "code": "C",
            "quantity": 11,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ]
      }
    },
    {
      "id": "742",
      "pokedexId": 742,
      "name": "萌虻",
      "sourceNameZh": "萌虻",
      "nameEn": "Cutiefly",
      "specialty": "ingredient",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4500,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.199,
      "skillRatePct": 1.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "742",
        "previous": null,
        "next": [
          {
            "id": "743",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 19
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "743"
      ],
      "defaultFinalId": "743",
      "mainSkill": {
        "id": 28,
        "name": "食材精选S",
        "nameEn": "Ingredient Draw S"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 5,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 7,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 6,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 16,
            "code": "C",
            "quantity": 5,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ]
      }
    },
    {
      "id": "743",
      "pokedexId": 743,
      "name": "蝶结萌虻",
      "sourceNameZh": "蝶結萌虻",
      "nameEn": "Ribombee",
      "specialty": "ingredient",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2300,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 24,
      "ingredientRate": 0.194,
      "skillRatePct": 2.5,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "742",
        "previous": {
          "id": "742",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "743"
      ],
      "defaultFinalId": "743",
      "mainSkill": {
        "id": 28,
        "name": "食材精选S",
        "nameEn": "Ingredient Draw S"
      },
      "ingredients": {
        "1": [
          {
            "id": 9,
            "code": "A",
            "quantity": 2,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          }
        ],
        "30": [
          {
            "id": 9,
            "code": "A",
            "quantity": 5,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "60": [
          {
            "id": 9,
            "code": "A",
            "quantity": 7,
            "name": "甜甜蜜",
            "nameEn": "Honey"
          },
          {
            "id": 10,
            "code": "B",
            "quantity": 6,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 16,
            "code": "C",
            "quantity": 5,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ]
      }
    },
    {
      "id": "759",
      "pokedexId": 759,
      "name": "童偶熊",
      "sourceNameZh": "童偶熊",
      "nameEn": "Stufful",
      "specialty": "ingredient",
      "typeId": 7,
      "berryId": 7,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4100,
      "carryLimitBase": 13,
      "carryLimitRaisedFromFirstStage": 13,
      "ingredientRate": 0.225,
      "skillRatePct": 1.1,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "759",
        "previous": null,
        "next": [
          {
            "id": "760",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 20
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "760"
      ],
      "defaultFinalId": "760",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 16,
            "code": "A",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "30": [
          {
            "id": 16,
            "code": "A",
            "quantity": 5,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 6,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 16,
            "code": "A",
            "quantity": 7,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 10,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 9,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "760",
      "pokedexId": 760,
      "name": "穿着熊",
      "sourceNameZh": "穿著熊",
      "nameEn": "Bewear",
      "specialty": "ingredient",
      "typeId": 7,
      "berryId": 7,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 25,
      "ingredientRate": 0.229,
      "skillRatePct": 1.3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "759",
        "previous": {
          "id": "759",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "760"
      ],
      "defaultFinalId": "760",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 16,
            "code": "A",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "30": [
          {
            "id": 16,
            "code": "A",
            "quantity": 5,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 6,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 16,
            "code": "A",
            "quantity": 7,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 10,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 9,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "764",
      "pokedexId": 764,
      "name": "花疗环环",
      "sourceNameZh": "花療環環",
      "nameEn": "Comfey",
      "specialty": "ingredient",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.167,
      "skillRatePct": 3.5,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "764",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "764"
      ],
      "defaultFinalId": "764",
      "mainSkill": {
        "id": 4,
        "name": "活力疗愈S",
        "nameEn": "Energizing Cheer S"
      },
      "ingredients": {
        "1": [
          {
            "id": 16,
            "code": "A",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "30": [
          {
            "id": 16,
            "code": "A",
            "quantity": 5,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 6,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 16,
            "code": "A",
            "quantity": 7,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 9,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 13,
            "code": "C",
            "quantity": 7,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ]
      }
    },
    {
      "id": "777",
      "pokedexId": 777,
      "name": "托戈德玛尔",
      "sourceNameZh": "托戈德瑪爾",
      "nameEn": "Togedemaru",
      "specialty": "skill",
      "typeId": 17,
      "berryId": 17,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2700,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 18,
      "ingredientRate": 0.169,
      "skillRatePct": 5.5,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "777",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "777"
      ],
      "defaultFinalId": "777",
      "mainSkill": {
        "id": 30,
        "name": "蹭蹭脸颊（活力疗愈S）",
        "nameEn": "Nuzzle (Energizing Cheer S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 19,
            "code": "B",
            "quantity": 1,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 19,
            "code": "B",
            "quantity": 2,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          },
          {
            "id": 13,
            "code": "C",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ]
      }
    },
    {
      "id": "778",
      "pokedexId": 778,
      "name": "谜拟Ｑ",
      "sourceNameZh": "謎擬Ｑ",
      "nameEn": "Mimikyu",
      "specialty": "skill",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.153,
      "skillRatePct": 3.5,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "778",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "778"
      ],
      "defaultFinalId": "778",
      "mainSkill": {
        "id": 17,
        "name": "画皮（树果骤增）",
        "nameEn": "Disguise (Berry Burst)"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 1,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 2,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 2,
            "code": "C",
            "quantity": 2,
            "name": "品鲜蘑菇",
            "nameEn": "Tasty Mushroom"
          }
        ]
      }
    },
    {
      "id": "780",
      "pokedexId": 780,
      "name": "老翁龙",
      "sourceNameZh": "老翁龍",
      "nameEn": "Drampa",
      "specialty": "ingredient",
      "typeId": 15,
      "berryId": 15,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3500,
      "carryLimitBase": 25,
      "carryLimitRaisedFromFirstStage": 25,
      "ingredientRate": 0.294,
      "skillRatePct": 4.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "780",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "780"
      ],
      "defaultFinalId": "780",
      "mainSkill": {
        "id": 14,
        "name": "料理成功S",
        "nameEn": "Tasty Chance S"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 5,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 19,
            "code": "B",
            "quantity": 3,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 7,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 19,
            "code": "B",
            "quantity": 4,
            "name": "嫩亮酪梨",
            "nameEn": "Glossy Avocado"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 7,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "845",
      "pokedexId": 845,
      "name": "古月鸟",
      "sourceNameZh": "古月鳥",
      "nameEn": "Cramorant",
      "specialty": "ingredient",
      "typeId": 10,
      "berryId": 10,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2700,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.165,
      "skillRatePct": 3.9,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "845",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "845"
      ],
      "defaultFinalId": "845",
      "mainSkill": {
        "id": 14,
        "name": "料理成功S",
        "nameEn": "Tasty Chance S"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 5,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 4,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 7,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 4,
            "code": "B",
            "quantity": 7,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 8,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "848",
      "pokedexId": 848,
      "name": "毒电婴",
      "sourceNameZh": "毒電嬰",
      "nameEn": "Toxel",
      "specialty": "skill",
      "typeId": 8,
      "berryId": 8,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5600,
      "carryLimitBase": 6,
      "carryLimitRaisedFromFirstStage": 6,
      "ingredientRate": 0.209,
      "skillRatePct": 4.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "848",
        "previous": null,
        "next": [
          {
            "id": "849",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 23
              },
              {
                "type": "nature",
                "nature": [
                  2,
                  3,
                  4,
                  6,
                  7,
                  11,
                  16,
                  18,
                  19,
                  20,
                  22,
                  23,
                  24
                ]
              }
            ]
          },
          {
            "id": "8001",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 23
              },
              {
                "type": "nature",
                "nature": [
                  1,
                  5,
                  8,
                  9,
                  10,
                  12,
                  13,
                  14,
                  15,
                  17,
                  21,
                  25
                ]
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "849",
        "8001"
      ],
      "defaultFinalId": "8001",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "849",
      "pokedexId": 849,
      "name": "颤弦蝾螈（高调的样子）",
      "sourceNameZh": "顫弦蠑螈（高調的樣子）",
      "nameEn": "Toxtricity (Amped Form)",
      "specialty": "skill",
      "typeId": 8,
      "berryId": 8,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3100,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 23,
      "ingredientRate": 0.239,
      "skillRatePct": 6.4,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "848",
        "previous": {
          "id": "848",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "849"
      ],
      "defaultFinalId": "849",
      "mainSkill": {
        "id": 26,
        "name": "正电（食材获取S）",
        "nameEn": "Plus (Ingredient Magnet S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "906",
      "pokedexId": 906,
      "name": "新叶喵",
      "sourceNameZh": "新葉喵",
      "nameEn": "Sprigatito",
      "specialty": "ingredient",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4600,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.208,
      "skillRatePct": 2.3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "906",
        "previous": null,
        "next": [
          {
            "id": "907",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "908"
      ],
      "defaultFinalId": "908",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 4,
            "code": "A",
            "quantity": 2,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "30": [
          {
            "id": 4,
            "code": "A",
            "quantity": 5,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 6,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "60": [
          {
            "id": 4,
            "code": "A",
            "quantity": 7,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 9,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 11,
            "code": "C",
            "quantity": 8,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ]
      }
    },
    {
      "id": "907",
      "pokedexId": 907,
      "name": "蒂蕾喵",
      "sourceNameZh": "蒂蕾喵",
      "nameEn": "Floragato",
      "specialty": "ingredient",
      "typeId": 5,
      "berryId": 5,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3500,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.209,
      "skillRatePct": 2.3,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "906",
        "previous": {
          "id": "906",
          "conditions": []
        },
        "next": [
          {
            "id": "908",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 27
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "908"
      ],
      "defaultFinalId": "908",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 4,
            "code": "A",
            "quantity": 2,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "30": [
          {
            "id": 4,
            "code": "A",
            "quantity": 5,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 6,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "60": [
          {
            "id": 4,
            "code": "A",
            "quantity": 7,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 9,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 11,
            "code": "C",
            "quantity": 8,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ]
      }
    },
    {
      "id": "908",
      "pokedexId": 908,
      "name": "魔幻假面喵",
      "sourceNameZh": "魔幻假面喵",
      "nameEn": "Meowscarada",
      "specialty": "ingredient",
      "typeId": 16,
      "berryId": 16,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2600,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 28,
      "ingredientRate": 0.19,
      "skillRatePct": 2.2,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "906",
        "previous": {
          "id": "907",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "908"
      ],
      "defaultFinalId": "908",
      "mainSkill": {
        "id": 11,
        "name": "料理强化S",
        "nameEn": "Cooking Power-Up S"
      },
      "ingredients": {
        "1": [
          {
            "id": 4,
            "code": "A",
            "quantity": 2,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "30": [
          {
            "id": 4,
            "code": "A",
            "quantity": 5,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 6,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "60": [
          {
            "id": 4,
            "code": "A",
            "quantity": 7,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 9,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 11,
            "code": "C",
            "quantity": 8,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ]
      }
    },
    {
      "id": "909",
      "pokedexId": 909,
      "name": "呆火鳄",
      "sourceNameZh": "呆火鱷",
      "nameEn": "Fuecoco",
      "specialty": "ingredient",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4200,
      "carryLimitBase": 11,
      "carryLimitRaisedFromFirstStage": 11,
      "ingredientRate": 0.254,
      "skillRatePct": 5.3,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "909",
        "previous": null,
        "next": [
          {
            "id": "910",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "911"
      ],
      "defaultFinalId": "911",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 5,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 7,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 6,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 6,
            "code": "C",
            "quantity": 5,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "910",
      "pokedexId": 910,
      "name": "炙烫鳄",
      "sourceNameZh": "炙燙鱷",
      "nameEn": "Crocalor",
      "specialty": "ingredient",
      "typeId": 2,
      "berryId": 2,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3100,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.247,
      "skillRatePct": 5,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "909",
        "previous": {
          "id": "909",
          "conditions": []
        },
        "next": [
          {
            "id": "911",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 27
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "911"
      ],
      "defaultFinalId": "911",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 5,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 7,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 6,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 6,
            "code": "C",
            "quantity": 5,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "911",
      "pokedexId": 911,
      "name": "骨纹巨声鳄",
      "sourceNameZh": "骨紋巨聲鱷",
      "nameEn": "Skeledirge",
      "specialty": "ingredient",
      "typeId": 14,
      "berryId": 14,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2700,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 29,
      "ingredientRate": 0.268,
      "skillRatePct": 6.2,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "909",
        "previous": {
          "id": "910",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "911"
      ],
      "defaultFinalId": "911",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 5,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 7,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 6,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 6,
            "code": "C",
            "quantity": 5,
            "name": "火辣香草",
            "nameEn": "Fiery Herb"
          }
        ]
      }
    },
    {
      "id": "912",
      "pokedexId": 912,
      "name": "润水鸭",
      "sourceNameZh": "潤水鴨",
      "nameEn": "Quaxly",
      "specialty": "ingredient",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4800,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.261,
      "skillRatePct": 2.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "912",
        "previous": null,
        "next": [
          {
            "id": "913",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 12
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "914"
      ],
      "defaultFinalId": "914",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 5,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 7,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 4,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 6,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "913",
      "pokedexId": 913,
      "name": "涌跃鸭",
      "sourceNameZh": "湧躍鴨",
      "nameEn": "Quaxwell",
      "specialty": "ingredient",
      "typeId": 3,
      "berryId": 3,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3600,
      "carryLimitBase": 14,
      "carryLimitRaisedFromFirstStage": 19,
      "ingredientRate": 0.259,
      "skillRatePct": 2.7,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "912",
        "previous": {
          "id": "912",
          "conditions": []
        },
        "next": [
          {
            "id": "914",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 27
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "914"
      ],
      "defaultFinalId": "914",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 5,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 7,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 4,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 6,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "914",
      "pokedexId": 914,
      "name": "狂欢浪舞鸭",
      "sourceNameZh": "狂歡浪舞鴨",
      "nameEn": "Quaquaval",
      "specialty": "ingredient",
      "typeId": 7,
      "berryId": 7,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2600,
      "carryLimitBase": 19,
      "carryLimitRaisedFromFirstStage": 29,
      "ingredientRate": 0.232,
      "skillRatePct": 2.4,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "912",
        "previous": {
          "id": "913",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "914"
      ],
      "defaultFinalId": "914",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 5,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 7,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 1,
            "code": "B",
            "quantity": 4,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          },
          {
            "id": 10,
            "code": "C",
            "quantity": 6,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ]
      }
    },
    {
      "id": "921",
      "pokedexId": 921,
      "name": "布拨",
      "sourceNameZh": "布撥",
      "nameEn": "Pawmi",
      "specialty": "skill",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 4600,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.111,
      "skillRatePct": 3.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "921",
        "previous": null,
        "next": [
          {
            "id": "922",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 14
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "923"
      ],
      "defaultFinalId": "923",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 3,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 4,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 6,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 5,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "922",
      "pokedexId": 922,
      "name": "布土拨",
      "sourceNameZh": "布土撥",
      "nameEn": "Pawmo",
      "specialty": "skill",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3300,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 17,
      "ingredientRate": 0.109,
      "skillRatePct": 3.6,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "921",
        "previous": {
          "id": "921",
          "conditions": []
        },
        "next": [
          {
            "id": "923",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "sleepTime",
                "hours": 150
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "923"
      ],
      "defaultFinalId": "923",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 3,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 4,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 6,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 5,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "923",
      "pokedexId": 923,
      "name": "巴布土拨",
      "sourceNameZh": "巴布土撥",
      "nameEn": "Pawmot",
      "specialty": "skill",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 28,
      "ingredientRate": 0.141,
      "skillRatePct": 3.9,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "921",
        "previous": {
          "id": "922",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "923"
      ],
      "defaultFinalId": "923",
      "mainSkill": {
        "id": 8,
        "name": "活力全体疗愈S",
        "nameEn": "Energy for Everyone S"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 3,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 4,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 8,
            "code": "B",
            "quantity": 6,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 5,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "957",
      "pokedexId": 957,
      "name": "小锻匠",
      "sourceNameZh": "小鍛匠",
      "nameEn": "Tinkatink",
      "specialty": "berry",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 4500,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 12,
      "ingredientRate": 0.202,
      "skillRatePct": 1.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 2,
        "lineId": "957",
        "previous": null,
        "next": [
          {
            "id": "958",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 18
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "959"
      ],
      "defaultFinalId": "959",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 1,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "958",
      "pokedexId": 958,
      "name": "巧锻匠",
      "sourceNameZh": "巧鍛匠",
      "nameEn": "Tinkatuff",
      "specialty": "berry",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3300,
      "carryLimitBase": 16,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.186,
      "skillRatePct": 1.8,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 1,
        "lineId": "957",
        "previous": {
          "id": "957",
          "conditions": []
        },
        "next": [
          {
            "id": "959",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "level",
                "level": 29
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "959"
      ],
      "defaultFinalId": "959",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 1,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "959",
      "pokedexId": 959,
      "name": "巨锻匠",
      "sourceNameZh": "巨鍛匠",
      "nameEn": "Tinkaton",
      "specialty": "berry",
      "typeId": 18,
      "berryId": 18,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2400,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 30,
      "ingredientRate": 0.185,
      "skillRatePct": 2,
      "expType": 1,
      "stage": 3,
      "evolution": {
        "stage": 3,
        "stageToFinal": 0,
        "lineId": "957",
        "previous": {
          "id": "958",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "959"
      ],
      "defaultFinalId": "959",
      "mainSkill": {
        "id": 2,
        "name": "能量填充M",
        "nameEn": "Charge Strength M"
      },
      "ingredients": {
        "1": [
          {
            "id": 12,
            "code": "A",
            "quantity": 1,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          }
        ],
        "30": [
          {
            "id": 12,
            "code": "A",
            "quantity": 2,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 12,
            "code": "A",
            "quantity": 4,
            "name": "好眠番茄",
            "nameEn": "Snoozy Tomato"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 3,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "974",
      "pokedexId": 974,
      "name": "走鲸",
      "sourceNameZh": "走鯨",
      "nameEn": "Cetoddle",
      "specialty": "ingredient",
      "typeId": 6,
      "berryId": 6,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 5100,
      "carryLimitBase": 12,
      "carryLimitRaisedFromFirstStage": 12,
      "ingredientRate": 0.223,
      "skillRatePct": 4.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "974",
        "previous": null,
        "next": [
          {
            "id": "975",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 26,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "975"
      ],
      "defaultFinalId": "975",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 4,
            "code": "A",
            "quantity": 2,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "30": [
          {
            "id": 4,
            "code": "A",
            "quantity": 5,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 4,
            "code": "A",
            "quantity": 7,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 9,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 18,
            "code": "C",
            "quantity": 4,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ]
      }
    },
    {
      "id": "975",
      "pokedexId": 975,
      "name": "浩大鲸",
      "sourceNameZh": "浩大鯨",
      "nameEn": "Cetitan",
      "specialty": "ingredient",
      "typeId": 6,
      "berryId": 6,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2800,
      "carryLimitBase": 25,
      "carryLimitRaisedFromFirstStage": 30,
      "ingredientRate": 0.209,
      "skillRatePct": 4.2,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "974",
        "previous": {
          "id": "974",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "975"
      ],
      "defaultFinalId": "975",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 4,
            "code": "A",
            "quantity": 2,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ],
        "30": [
          {
            "id": 4,
            "code": "A",
            "quantity": 5,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 5,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 4,
            "code": "A",
            "quantity": 7,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 9,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 18,
            "code": "C",
            "quantity": 4,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ]
      }
    },
    {
      "id": "980",
      "pokedexId": 980,
      "name": "土王",
      "sourceNameZh": "土王",
      "nameEn": "Clodsire",
      "specialty": "ingredient",
      "typeId": 8,
      "berryId": 8,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3500,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 25,
      "ingredientRate": 0.208,
      "skillRatePct": 5.5,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "7054",
        "previous": {
          "id": "7054",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "980"
      ],
      "defaultFinalId": "980",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 5,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 4,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 7,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 7,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 9,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "7006",
      "pokedexId": 7006,
      "name": "六尾（阿罗拉的样子）",
      "sourceNameZh": "六尾（阿羅拉的樣子）",
      "nameEn": "Vulpix (Alolan Form)",
      "specialty": "berry",
      "typeId": 6,
      "berryId": 6,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 5600,
      "carryLimitBase": 10,
      "carryLimitRaisedFromFirstStage": 10,
      "ingredientRate": 0.23,
      "skillRatePct": 2.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "7006",
        "previous": null,
        "next": [
          {
            "id": "7007",
            "conditions": [
              {
                "type": "candy",
                "count": 80
              },
              {
                "type": "item",
                "item": 26,
                "count": 1
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "7007"
      ],
      "defaultFinalId": "7007",
      "mainSkill": {
        "id": 9,
        "name": "帮手支援S",
        "nameEn": "Extra Helpful S"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 1,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 3,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "7007",
      "pokedexId": 7007,
      "name": "九尾（阿罗拉的样子）",
      "sourceNameZh": "九尾（阿羅拉的樣子）",
      "nameEn": "Ninetales (Alolan Form)",
      "specialty": "berry",
      "typeId": 6,
      "berryId": 6,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2900,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 25,
      "ingredientRate": 0.232,
      "skillRatePct": 2.8,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "7006",
        "previous": {
          "id": "7006",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "7007"
      ],
      "defaultFinalId": "7007",
      "mainSkill": {
        "id": 9,
        "name": "帮手支援S",
        "nameEn": "Extra Helpful S"
      },
      "ingredients": {
        "1": [
          {
            "id": 15,
            "code": "A",
            "quantity": 1,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          }
        ],
        "30": [
          {
            "id": 15,
            "code": "A",
            "quantity": 2,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 2,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          }
        ],
        "60": [
          {
            "id": 15,
            "code": "A",
            "quantity": 4,
            "name": "萌绿大豆",
            "nameEn": "Greengrass Soybeans"
          },
          {
            "id": 16,
            "code": "B",
            "quantity": 3,
            "name": "萌绿玉米",
            "nameEn": "Greengrass Corn"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 3,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "7054",
      "pokedexId": 7054,
      "name": "乌波（帕底亚的样子）",
      "sourceNameZh": "烏波（帕底亞的樣子）",
      "nameEn": "Wooper (Paldean Form)",
      "specialty": "ingredient",
      "typeId": 8,
      "berryId": 8,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 6400,
      "carryLimitBase": 9,
      "carryLimitRaisedFromFirstStage": 9,
      "ingredientRate": 0.209,
      "skillRatePct": 5.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 1,
        "lineId": "7054",
        "previous": null,
        "next": [
          {
            "id": "980",
            "conditions": [
              {
                "type": "candy",
                "count": 40
              },
              {
                "type": "level",
                "level": 15
              }
            ]
          }
        ]
      },
      "isFinalEvolution": false,
      "finalOptions": [
        "980"
      ],
      "defaultFinalId": "980",
      "mainSkill": {
        "id": 7,
        "name": "活力填充S",
        "nameEn": "Charge Energy S"
      },
      "ingredients": {
        "1": [
          {
            "id": 13,
            "code": "A",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "30": [
          {
            "id": 13,
            "code": "A",
            "quantity": 5,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 4,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          }
        ],
        "60": [
          {
            "id": 13,
            "code": "A",
            "quantity": 7,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 17,
            "code": "B",
            "quantity": 7,
            "name": "醒脑咖啡豆",
            "nameEn": "Rousing Coffee"
          },
          {
            "id": 4,
            "code": "C",
            "quantity": 9,
            "name": "窝心洋芋",
            "nameEn": "Soft Potato"
          }
        ]
      }
    },
    {
      "id": "8001",
      "pokedexId": 8001,
      "name": "颤弦蝾螈（低调的样子）",
      "sourceNameZh": "顫弦蠑螈（低調的樣子）",
      "nameEn": "Toxtricity (Low Key Form)",
      "specialty": "skill",
      "typeId": 8,
      "berryId": 8,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3100,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 23,
      "ingredientRate": 0.239,
      "skillRatePct": 6.4,
      "expType": 1,
      "stage": 2,
      "evolution": {
        "stage": 2,
        "stageToFinal": 0,
        "lineId": "848",
        "previous": {
          "id": "848",
          "conditions": []
        },
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "8001"
      ],
      "defaultFinalId": "8001",
      "mainSkill": {
        "id": 27,
        "name": "负电（料理强化S）",
        "nameEn": "Minus (Cooking Power-Up S)"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 5,
            "code": "B",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 1,
            "code": "C",
            "quantity": 2,
            "name": "粗枝大葱",
            "nameEn": "Large Leek"
          }
        ]
      }
    },
    {
      "id": "9001-1",
      "pokedexId": 9001,
      "name": "皮卡丘（万圣节）",
      "sourceNameZh": "皮卡丘（萬聖節）",
      "nameEn": "Pikachu (Halloween)",
      "specialty": "berry",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 18,
      "ingredientRate": 0.218,
      "skillRatePct": 2.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "9001",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "9001-1"
      ],
      "defaultFinalId": "9001-1",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "9001-2",
      "pokedexId": 9001,
      "name": "皮卡丘（万圣节）",
      "sourceNameZh": "皮卡丘（萬聖節）",
      "nameEn": "Pikachu (Halloween)",
      "specialty": "berry",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 18,
      "ingredientRate": 0.218,
      "skillRatePct": 2.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "9001",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "9001-2"
      ],
      "defaultFinalId": "9001-2",
      "mainSkill": {
        "id": 5,
        "name": "能量填充S（随机）",
        "nameEn": "Charge Strength S (Random)"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "9002",
      "pokedexId": 9002,
      "name": "皮卡丘（佳节）",
      "sourceNameZh": "皮卡丘（佳節）",
      "nameEn": "Pikachu (Holiday)",
      "specialty": "skill",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.131,
      "skillRatePct": 4.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "9002",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "9002"
      ],
      "defaultFinalId": "9002",
      "mainSkill": {
        "id": 3,
        "name": "梦之碎片获取S",
        "nameEn": "Dream Shard Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    },
    {
      "id": "9004",
      "pokedexId": 9004,
      "name": "伊布（佳节）",
      "sourceNameZh": "伊布（佳節）",
      "nameEn": "Eevee (Holiday)",
      "specialty": "berry",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 3100,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.156,
      "skillRatePct": 3.2,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "9004",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "9004"
      ],
      "defaultFinalId": "9004",
      "mainSkill": {
        "id": 3,
        "name": "梦之碎片获取S",
        "nameEn": "Dream Shard Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 8,
            "code": "A",
            "quantity": 1,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ],
        "30": [
          {
            "id": 8,
            "code": "A",
            "quantity": 2,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 1,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 8,
            "code": "A",
            "quantity": 4,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 2,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 7,
            "code": "C",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ]
      }
    },
    {
      "id": "9005",
      "pokedexId": 9005,
      "name": "伊布（万圣节）",
      "sourceNameZh": "伊布（萬聖節）",
      "nameEn": "Eevee (Halloween)",
      "specialty": "skill",
      "typeId": 1,
      "berryId": 1,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3200,
      "carryLimitBase": 18,
      "carryLimitRaisedFromFirstStage": 18,
      "ingredientRate": 0.12,
      "skillRatePct": 4.6,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "9005",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "9005"
      ],
      "defaultFinalId": "9005",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 18,
            "code": "A",
            "quantity": 1,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          }
        ],
        "30": [
          {
            "id": 18,
            "code": "A",
            "quantity": 2,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 4,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          }
        ],
        "60": [
          {
            "id": 18,
            "code": "A",
            "quantity": 4,
            "name": "沉甸甸南瓜",
            "nameEn": "Plump Pumpkin"
          },
          {
            "id": 13,
            "code": "B",
            "quantity": 6,
            "name": "放松可可",
            "nameEn": "Soothing Cacao"
          },
          {
            "id": 8,
            "code": "C",
            "quantity": 9,
            "name": "哞哞鲜奶",
            "nameEn": "Moomoo Milk"
          }
        ]
      }
    },
    {
      "id": "9006",
      "pokedexId": 9006,
      "name": "海豹球（佳节）",
      "sourceNameZh": "海豹球（佳節）",
      "nameEn": "Spheal (Holiday)",
      "specialty": "skill",
      "typeId": 6,
      "berryId": 6,
      "baseBerryCount": 1,
      "helpFrequencyBaseSec": 3300,
      "carryLimitBase": 20,
      "carryLimitRaisedFromFirstStage": 20,
      "ingredientRate": 0.214,
      "skillRatePct": 5,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "9006",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "9006"
      ],
      "defaultFinalId": "9006",
      "mainSkill": {
        "id": 14,
        "name": "料理成功S",
        "nameEn": "Tasty Chance S"
      },
      "ingredients": {
        "1": [
          {
            "id": 10,
            "code": "A",
            "quantity": 1,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          }
        ],
        "30": [
          {
            "id": 10,
            "code": "A",
            "quantity": 2,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 3,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          }
        ],
        "60": [
          {
            "id": 10,
            "code": "A",
            "quantity": 4,
            "name": "纯粹油",
            "nameEn": "Pure Oil"
          },
          {
            "id": 7,
            "code": "B",
            "quantity": 4,
            "name": "豆制肉",
            "nameEn": "Bean Sausage"
          },
          {
            "id": 11,
            "code": "C",
            "quantity": 4,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ]
      }
    },
    {
      "id": "9007",
      "pokedexId": 9007,
      "name": "皮卡丘（船长）",
      "sourceNameZh": "皮卡丘（船長）",
      "nameEn": "Pikachu (Captain)",
      "specialty": "berry",
      "typeId": 4,
      "berryId": 4,
      "baseBerryCount": 2,
      "helpFrequencyBaseSec": 2500,
      "carryLimitBase": 21,
      "carryLimitRaisedFromFirstStage": 21,
      "ingredientRate": 0.175,
      "skillRatePct": 1.8,
      "expType": 1,
      "stage": 1,
      "evolution": {
        "stage": 1,
        "stageToFinal": 0,
        "lineId": "9007",
        "previous": null,
        "next": []
      },
      "isFinalEvolution": true,
      "finalOptions": [
        "9007"
      ],
      "defaultFinalId": "9007",
      "mainSkill": {
        "id": 10,
        "name": "食材获取S",
        "nameEn": "Ingredient Magnet S"
      },
      "ingredients": {
        "1": [
          {
            "id": 5,
            "code": "A",
            "quantity": 1,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          }
        ],
        "30": [
          {
            "id": 5,
            "code": "A",
            "quantity": 2,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 2,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          }
        ],
        "60": [
          {
            "id": 5,
            "code": "A",
            "quantity": 4,
            "name": "特选苹果",
            "nameEn": "Fancy Apple"
          },
          {
            "id": 11,
            "code": "B",
            "quantity": 3,
            "name": "暖暖姜",
            "nameEn": "Warming Ginger"
          },
          {
            "id": 3,
            "code": "C",
            "quantity": 3,
            "name": "特选蛋",
            "nameEn": "Fancy Egg"
          }
        ]
      }
    }
  ],
  "speciesScores": {
    "3": {
      "specialty": "ingredient",
      "mechanicalScore": 80.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": {
        "name": "妙蛙花",
        "stage": "required",
        "role": "甜甜蜜专职",
        "ingredient": "甜甜蜜",
        "rank": "primary",
        "reason": "高阶甜甜蜜岗位。"
      },
      "score": 80.7,
      "source": "ingredient-species-score"
    },
    "6": {
      "specialty": "ingredient",
      "mechanicalScore": 79.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": {
        "name": "喷火龙",
        "stage": "required",
        "role": "豆制肉专职",
        "ingredient": "豆制肉",
        "rank": "primary",
        "reason": "豆制肉主要供给路线之一。"
      },
      "score": 79.8,
      "source": "ingredient-species-score"
    },
    "9": {
      "specialty": "ingredient",
      "mechanicalScore": 82.2,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": {
        "name": "水箭龟",
        "stage": "required",
        "role": "鲜奶／可可核心",
        "ingredient": "哞哞鲜奶",
        "rank": "primary",
        "reason": "鲜奶核心，同时可承担可可路线。"
      },
      "score": 82.2,
      "source": "ingredient-species-score"
    },
    "12": {
      "specialty": "berry",
      "mechanicalScore": 77,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 77,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 64.39,
          "berryStrengthPerDay": 8499.4,
          "productionScore": 79,
          "rank": 23
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 80.19,
          "berryStrengthPerDay": 10584.5,
          "productionScore": 77,
          "rank": 24
        },
        "rankChangeWhenFull": -1,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "20": {
      "specialty": "berry",
      "mechanicalScore": 73.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 73.3,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 51.85,
          "berryStrengthPerDay": 7984.7,
          "productionScore": 74.2,
          "rank": 29
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 67.95,
          "berryStrengthPerDay": 10464.9,
          "productionScore": 76.1,
          "rank": 25
        },
        "rankChangeWhenFull": 4,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "24": {
      "specialty": "berry",
      "mechanicalScore": 71.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 71.8,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 43.39,
          "berryStrengthPerDay": 7637.4,
          "productionScore": 71,
          "rank": 30
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 58.96,
          "berryStrengthPerDay": 10377,
          "productionScore": 75.5,
          "rank": 26
        },
        "rankChangeWhenFull": 4,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "26": {
      "specialty": "berry",
      "mechanicalScore": 87.5,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 87.5,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 70.71,
          "berryStrengthPerDay": 9687.2,
          "productionScore": 90,
          "rank": 8
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 91.12,
          "berryStrengthPerDay": 12483.4,
          "productionScore": 90.8,
          "rank": 3
        },
        "rankChangeWhenFull": 5,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "28": {
      "specialty": "skill",
      "mechanicalScore": 62.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 62.8,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "灰褐洞窟",
        "candidateTeam": "沙奈朵＋穿山王＋火爆獸×3",
        "baselineTeam": "沙奈朵＋火爆獸×4",
        "yieldCoefficient": 0.9718,
        "stabilityScore": 72.4,
        "operationScore": 70.5,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "36": {
      "specialty": "berry",
      "mechanicalScore": 77.9,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 77.9,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 59.57,
          "berryStrengthPerDay": 8518,
          "productionScore": 79.1,
          "rank": 22
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 71.59,
          "berryStrengthPerDay": 10238,
          "productionScore": 74.5,
          "rank": 28
        },
        "rankChangeWhenFull": -6,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "38": {
      "specialty": "berry",
      "mechanicalScore": 85.5,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 85.5,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 64.46,
          "berryStrengthPerDay": 9539.6,
          "productionScore": 88.6,
          "rank": 10
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 77.1,
          "berryStrengthPerDay": 11411,
          "productionScore": 83,
          "rank": 14
        },
        "rankChangeWhenFull": -4,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "40": {
      "specialty": "skill",
      "mechanicalScore": 78.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 78.8,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "天青沙滩",
        "candidateTeam": "胖可丁＋大力鳄×4",
        "baselineTeam": "大力鳄×5",
        "yieldCoefficient": 1.083,
        "stabilityScore": 100,
        "operationScore": 72.2,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;dynamic-energy-confirmed-brackets"
      }
    },
    "51": {
      "specialty": "ingredient",
      "mechanicalScore": 61.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 61.7,
      "source": "ingredient-species-score"
    },
    "53": {
      "specialty": "skill",
      "mechanicalScore": 61,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 61,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "白花雪原",
        "candidateTeam": "沙奈朵＋猫老大＋九尾（阿羅拉的樣子）×3",
        "baselineTeam": "沙奈朵＋九尾（阿羅拉的樣子）×4",
        "yieldCoefficient": 0.9888,
        "stabilityScore": 100,
        "operationScore": 58.1,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;computed-standard-team"
      }
    },
    "55": {
      "specialty": "skill",
      "mechanicalScore": 62.6,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 62.6,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "天青沙滩",
        "candidateTeam": "沙奈朵＋哥达鸭＋大力鱷×3",
        "baselineTeam": "沙奈朵＋大力鱷×4",
        "yieldCoefficient": 1.0124,
        "stabilityScore": 40,
        "operationScore": 56.9,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "57": {
      "specialty": "berry",
      "mechanicalScore": 75.6,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 75.6,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 57.28,
          "berryStrengthPerDay": 8476.8,
          "productionScore": 78.8,
          "rank": 24
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 71.59,
          "berryStrengthPerDay": 10596,
          "productionScore": 77.1,
          "rank": 23
        },
        "rankChangeWhenFull": 1,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "59": {
      "specialty": "skill",
      "mechanicalScore": 60.4,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 60.4,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "灰褐洞窟",
        "candidateTeam": "沙奈朵＋风速狗＋火爆獸×3",
        "baselineTeam": "沙奈朵＋火爆獸×4",
        "yieldCoefficient": 0.9858,
        "stabilityScore": 54.1,
        "operationScore": 59.7,
        "versatilityScore": 77.7,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "71": {
      "specialty": "ingredient",
      "mechanicalScore": 74.6,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 74.6,
      "source": "ingredient-species-score"
    },
    "76": {
      "specialty": "ingredient",
      "mechanicalScore": 76.5,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": {
        "name": "隆隆岩",
        "stage": "required",
        "role": "萌绿大豆专职",
        "ingredient": "萌绿大豆",
        "rank": "primary",
        "reason": "大豆主要供给路线之一。"
      },
      "score": 76.5,
      "source": "ingredient-species-score"
    },
    "80": {
      "specialty": "skill",
      "mechanicalScore": 64.1,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 64.1,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "天青沙滩",
        "candidateTeam": "呆壳兽＋大力鳄×4",
        "baselineTeam": "大力鳄×5",
        "yieldCoefficient": 1.0076,
        "stabilityScore": 80,
        "operationScore": 64.7,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;random-target-uniform-expectation;dynamic-energy-confirmed-brackets"
      }
    },
    "83": {
      "specialty": "ingredient",
      "mechanicalScore": 58.7,
      "strategicRoleScore": 70,
      "strategicBonus": 4.3,
      "strategy": {
        "name": "大葱鸭",
        "stage": "optional",
        "role": "粗枝大葱补位",
        "ingredient": "粗枝大葱",
        "rank": "alternative",
        "scorePolicy": {
          "targetFloor": 63,
          "maxBonus": 5,
          "value": 70
        },
        "reason": "大葱专项补位；机械分低时仍保留明确食谱岗位。"
      },
      "score": 63,
      "source": "ingredient-mechanical-plus-strategic-role"
    },
    "85": {
      "specialty": "berry",
      "mechanicalScore": 84.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 84.8,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 71.12,
          "berryStrengthPerDay": 9388,
          "productionScore": 87.2,
          "rank": 13
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 87.16,
          "berryStrengthPerDay": 11504.9,
          "productionScore": 83.7,
          "rank": 12
        },
        "rankChangeWhenFull": 1,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "94": {
      "specialty": "ingredient",
      "mechanicalScore": 68.4,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 68.4,
      "source": "ingredient-species-score"
    },
    "105": {
      "specialty": "berry",
      "mechanicalScore": 69.9,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 69.9,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 47.08,
          "berryStrengthPerDay": 7485.5,
          "productionScore": 69.5,
          "rank": 31
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 60.75,
          "berryStrengthPerDay": 9658.7,
          "productionScore": 70.3,
          "rank": 31
        },
        "rankChangeWhenFull": 0,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "115": {
      "specialty": "ingredient",
      "mechanicalScore": 72.9,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 72.9,
      "source": "ingredient-species-score"
    },
    "122": {
      "specialty": "ingredient",
      "mechanicalScore": 68.4,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 68.4,
      "source": "ingredient-species-score"
    },
    "127": {
      "specialty": "ingredient",
      "mechanicalScore": 74.4,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 74.4,
      "source": "ingredient-species-score"
    },
    "132": {
      "specialty": "ingredient",
      "mechanicalScore": 54.2,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 54.2,
      "source": "ingredient-species-score"
    },
    "134": {
      "specialty": "skill",
      "mechanicalScore": 62.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 62.3,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "天青沙滩",
        "candidateTeam": "沙奈朵＋水伊布＋大力鱷×3",
        "baselineTeam": "沙奈朵＋大力鱷×4",
        "yieldCoefficient": 0.986,
        "stabilityScore": 66.3,
        "operationScore": 66.2,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "135": {
      "specialty": "skill",
      "mechanicalScore": 60.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 60.3,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "黄金发电厂",
        "candidateTeam": "沙奈朵＋雷伊布＋雷丘×3",
        "baselineTeam": "沙奈朵＋雷丘×4",
        "yieldCoefficient": 0.9779,
        "stabilityScore": 53.1,
        "operationScore": 61.2,
        "versatilityScore": 76.5,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "136": {
      "specialty": "skill",
      "mechanicalScore": 62.4,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 62.4,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "灰褐洞窟",
        "candidateTeam": "沙奈朵＋火伊布＋火爆獸×3",
        "baselineTeam": "沙奈朵＋火爆獸×4",
        "yieldCoefficient": 0.9554,
        "stabilityScore": 100,
        "operationScore": 65.3,
        "versatilityScore": 69.8,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;aggregated-cooking-power-team-state-weighted-slots"
      }
    },
    "149": {
      "specialty": "ingredient",
      "mechanicalScore": 92.2,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": {
        "name": "快龙",
        "stage": "required",
        "role": "火辣香草专职",
        "ingredient": "火辣香草",
        "rank": "primary",
        "reason": "长期香草准神路线。"
      },
      "score": 92.2,
      "source": "ingredient-species-score"
    },
    "151": {
      "specialty": "all",
      "score": null,
      "source": "pending-all-rounder-formula"
    },
    "154": {
      "specialty": "berry",
      "mechanicalScore": 88.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 88.3,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 59.07,
          "berryStrengthPerDay": 9745.8,
          "productionScore": 90.5,
          "rank": 4
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 71.59,
          "berryStrengthPerDay": 11813.1,
          "productionScore": 85.9,
          "rank": 9
        },
        "rankChangeWhenFull": -5,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "157": {
      "specialty": "berry",
      "mechanicalScore": 88.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 88.7,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 66.15,
          "berryStrengthPerDay": 9790.7,
          "productionScore": 91,
          "rank": 3
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 83.53,
          "berryStrengthPerDay": 12361.9,
          "productionScore": 89.9,
          "rank": 4
        },
        "rankChangeWhenFull": -1,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "160": {
      "specialty": "berry",
      "mechanicalScore": 83.1,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 83.1,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 53.19,
          "berryStrengthPerDay": 9043.1,
          "productionScore": 84,
          "rank": 19
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 71.59,
          "berryStrengthPerDay": 12171,
          "productionScore": 88.5,
          "rank": 5
        },
        "rankChangeWhenFull": 14,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "178": {
      "specialty": "berry",
      "mechanicalScore": 83.9,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 83.9,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 64.87,
          "berryStrengthPerDay": 9276.4,
          "productionScore": 86.2,
          "rank": 15
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 80.19,
          "berryStrengthPerDay": 11466.5,
          "productionScore": 83.4,
          "rank": 13
        },
        "rankChangeWhenFull": 2,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "181": {
      "specialty": "skill",
      "mechanicalScore": 68.1,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 68.1,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "黄金发电厂",
        "candidateTeam": "沙奈朵＋电龙＋雷丘×3",
        "baselineTeam": "沙奈朵＋雷丘×4",
        "yieldCoefficient": 1.0164,
        "stabilityScore": 100,
        "operationScore": 71.2,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "185": {
      "specialty": "skill",
      "mechanicalScore": 64.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 64.8,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "灰褐洞窟",
        "candidateTeam": "沙奈朵＋树才怪＋火爆獸×3",
        "baselineTeam": "沙奈朵＋火爆獸×4",
        "yieldCoefficient": 0.9782,
        "stabilityScore": 100,
        "operationScore": 84.7,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "195": {
      "specialty": "ingredient",
      "mechanicalScore": 61,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 61,
      "source": "ingredient-species-score"
    },
    "196": {
      "specialty": "skill",
      "mechanicalScore": 75.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 75.7,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "宝蓝湖畔",
        "candidateTeam": "沙奈朵＋太阳伊布＋大竺葵×3",
        "baselineTeam": "沙奈朵＋大竺葵×4",
        "yieldCoefficient": 1.012,
        "stabilityScore": 100,
        "operationScore": 62.7,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;computed-standard-team"
      }
    },
    "197": {
      "specialty": "skill",
      "mechanicalScore": 60.1,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 60.1,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "白花雪原",
        "candidateTeam": "月亮伊布＋阿罗拉九尾×4",
        "baselineTeam": "阿罗拉九尾×5",
        "yieldCoefficient": 0.9371,
        "stabilityScore": 36,
        "operationScore": 50.3,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;random-target-uniform-expectation;dynamic-energy-confirmed-brackets"
      }
    },
    "199": {
      "specialty": "skill",
      "mechanicalScore": 57.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 57.7,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "天青沙滩",
        "candidateTeam": "呆呆王＋大力鳄×4",
        "baselineTeam": "大力鳄×5",
        "yieldCoefficient": 1.0307,
        "stabilityScore": 80,
        "operationScore": 60.4,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;random-target-uniform-expectation;dynamic-energy-confirmed-brackets"
      }
    },
    "202": {
      "specialty": "skill",
      "mechanicalScore": 62.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 62.8,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "宝蓝湖畔",
        "candidateTeam": "果然翁＋大竺葵×4",
        "baselineTeam": "大竺葵×5",
        "yieldCoefficient": 0.9965,
        "stabilityScore": 80,
        "operationScore": 62.1,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;random-target-uniform-expectation;dynamic-energy-confirmed-brackets"
      }
    },
    "208": {
      "specialty": "berry",
      "mechanicalScore": 92,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 92,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 56.53,
          "berryStrengthPerDay": 10232.1,
          "productionScore": 95.1,
          "rank": 2
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 66.82,
          "berryStrengthPerDay": 12094.7,
          "productionScore": 88,
          "rank": 7
        },
        "rankChangeWhenFull": -5,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "213": {
      "specialty": "skill",
      "mechanicalScore": 84.2,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 84.2,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "琥珀溪谷",
        "candidateTeam": "壶壶＋暴飞龙×4",
        "baselineTeam": "暴飞龙×5",
        "yieldCoefficient": 1.0769,
        "stabilityScore": 93.5,
        "operationScore": 53.7,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;berry-juice-25pct-provisional;berry-juice-stateful-expected-inventory;berry-juice-use-at-80-or-lower;dynamic-energy-confirmed-brackets"
      }
    },
    "214": {
      "specialty": "skill",
      "mechanicalScore": 82.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 82.3,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "琥珀溪谷",
        "candidateTeam": "沙奈朵＋赫拉克罗斯＋暴飛龍×3",
        "baselineTeam": "沙奈朵＋暴飛龍×4",
        "yieldCoefficient": 1.1429,
        "stabilityScore": 84.8,
        "operationScore": 62.4,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;aggregated-cooking-power-team-state-weighted-slots"
      }
    },
    "225": {
      "specialty": "ingredient",
      "mechanicalScore": 67.5,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 67.5,
      "source": "ingredient-species-score"
    },
    "229": {
      "specialty": "berry",
      "mechanicalScore": 75.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 75.8,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 48.42,
          "berryStrengthPerDay": 8230.6,
          "productionScore": 76.5,
          "rank": 27
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 60.75,
          "berryStrengthPerDay": 10326.9,
          "productionScore": 75.1,
          "rank": 27
        },
        "rankChangeWhenFull": 0,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "242": {
      "specialty": "ingredient",
      "mechanicalScore": 71.4,
      "strategicRoleScore": 75,
      "strategicBonus": 0.6,
      "strategy": {
        "name": "幸福蛋",
        "stage": "forming",
        "role": "特选蛋专职",
        "ingredient": "特选蛋",
        "rank": "primary",
        "scorePolicy": {
          "targetFloor": 72,
          "maxBonus": 2,
          "value": 75
        },
        "reason": "特选蛋是多道高系数料理的高需求原料。"
      },
      "score": 72,
      "source": "ingredient-mechanical-plus-strategic-role"
    },
    "243": {
      "specialty": "skill",
      "mechanicalScore": 75.4,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 75.4,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "特殊额外技能位",
        "sourceType": "special-fixed-team",
        "islandNameZh": "黄金发电厂",
        "candidateTeam": "沙奈朵＋雷公＋雷丘×3",
        "baselineTeam": "沙奈朵＋雷丘×4",
        "yieldCoefficient": 1.0328,
        "stabilityScore": 100,
        "operationScore": 57.7,
        "versatilityScore": 55.6,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;legal-one-special-pokemon;linear-natural-berry-helper-skills;fixed-equivalent-yield-not-dynamic-energy-overcap"
      }
    },
    "244": {
      "specialty": "skill",
      "mechanicalScore": 75.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 75.7,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "特殊额外技能位",
        "sourceType": "special-fixed-team",
        "islandNameZh": "灰褐洞窟",
        "candidateTeam": "沙奈朵＋炎帝＋火爆兽×3",
        "baselineTeam": "沙奈朵＋火爆兽×4",
        "yieldCoefficient": 1.0353,
        "stabilityScore": 100,
        "operationScore": 55.5,
        "versatilityScore": 55.6,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;legal-one-special-pokemon;linear-natural-berry-helper-skills;fixed-equivalent-yield-not-dynamic-energy-overcap"
      }
    },
    "245": {
      "specialty": "skill",
      "mechanicalScore": 78.1,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 78.1,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "特殊额外技能位",
        "sourceType": "special-fixed-team",
        "islandNameZh": "天青沙滩",
        "candidateTeam": "沙奈朵＋水君＋大力鳄×3",
        "baselineTeam": "沙奈朵＋大力鳄×4",
        "yieldCoefficient": 1.0501,
        "stabilityScore": 100,
        "operationScore": 54,
        "versatilityScore": 55.6,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;legal-one-special-pokemon;linear-natural-berry-helper-skills;fixed-equivalent-yield-not-dynamic-energy-overcap"
      }
    },
    "248": {
      "specialty": "ingredient",
      "mechanicalScore": 86.4,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": {
        "name": "班基拉斯",
        "stage": "required",
        "role": "暖暖姜专职",
        "ingredient": "暖暖姜",
        "rank": "primary",
        "reason": "长期暖暖姜准神路线。"
      },
      "score": 86.4,
      "source": "ingredient-species-score"
    },
    "254": {
      "specialty": "skill",
      "mechanicalScore": 85.9,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 85.9,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "宝蓝湖畔",
        "candidateTeam": "沙奈朵＋蜥蜴王＋大竺葵×3",
        "baselineTeam": "沙奈朵＋大竺葵×4",
        "yieldCoefficient": 1.1322,
        "stabilityScore": 100,
        "operationScore": 79.4,
        "versatilityScore": 73.7,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "257": {
      "specialty": "berry",
      "mechanicalScore": 89.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 89.7,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 65.31,
          "berryStrengthPerDay": 9665.1,
          "productionScore": 89.8,
          "rank": 9
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 77.1,
          "berryStrengthPerDay": 11411,
          "productionScore": 83,
          "rank": 15
        },
        "rankChangeWhenFull": -6,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "260": {
      "specialty": "berry",
      "mechanicalScore": 88.5,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 88.5,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 61.14,
          "berryStrengthPerDay": 9721.5,
          "productionScore": 90.3,
          "rank": 6
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 71.59,
          "berryStrengthPerDay": 11383.5,
          "productionScore": 82.8,
          "rank": 16
        },
        "rankChangeWhenFull": -10,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "282": {
      "specialty": "skill",
      "mechanicalScore": 85.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 85.7,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "宝蓝湖畔",
        "candidateTeam": "沙奈朵＋大竺葵×4",
        "baselineTeam": "大竺葵×5",
        "yieldCoefficient": 1.1271,
        "stabilityScore": 100,
        "operationScore": 65.6,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;dynamic-energy-confirmed-brackets"
      }
    },
    "289": {
      "specialty": "berry",
      "mechanicalScore": 55.9,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 55.9,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 36.81,
          "berryStrengthPerDay": 5668.3,
          "productionScore": 52.7,
          "rank": 32
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 55.68,
          "berryStrengthPerDay": 8575.4,
          "productionScore": 62.4,
          "rank": 32
        },
        "rankChangeWhenFull": 0,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "302": {
      "specialty": "skill",
      "mechanicalScore": 62.6,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 62.6,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "白花雪原",
        "candidateTeam": "沙奈朵＋勾魂眼＋九尾（阿羅拉的樣子）×3",
        "baselineTeam": "沙奈朵＋九尾（阿羅拉的樣子）×4",
        "yieldCoefficient": 1.0171,
        "stabilityScore": 40,
        "operationScore": 66.6,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "303": {
      "specialty": "ingredient",
      "mechanicalScore": 60.6,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 60.6,
      "source": "ingredient-species-score"
    },
    "306": {
      "specialty": "ingredient",
      "mechanicalScore": 82.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": {
        "name": "波士可多拉",
        "stage": "required",
        "role": "豆制肉／咖啡路线",
        "ingredient": "豆制肉",
        "rank": "primary",
        "reason": "肉位核心，并可补咖啡。"
      },
      "score": 82.3,
      "source": "ingredient-species-score"
    },
    "311": {
      "specialty": "skill",
      "mechanicalScore": 58.9,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 58.9,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "黄金发电厂",
        "candidateTeam": "沙奈朵＋正电拍拍＋雷丘×3",
        "baselineTeam": "沙奈朵＋雷丘×4",
        "yieldCoefficient": 0.9711,
        "stabilityScore": 80.2,
        "operationScore": 48.3,
        "versatilityScore": 58.7,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "312": {
      "specialty": "skill",
      "mechanicalScore": 60.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 60.3,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "黄金发电厂",
        "candidateTeam": "沙奈朵＋负电拍拍＋雷丘×3",
        "baselineTeam": "沙奈朵＋雷丘×4",
        "yieldCoefficient": 0.9503,
        "stabilityScore": 95.4,
        "operationScore": 44.7,
        "versatilityScore": 76.4,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "317": {
      "specialty": "skill",
      "mechanicalScore": 65,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 65,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "琥珀溪谷",
        "candidateTeam": "沙奈朵＋吞食兽＋暴飛龍×3",
        "baselineTeam": "沙奈朵＋暴飛龍×4",
        "yieldCoefficient": 1.0194,
        "stabilityScore": 40,
        "operationScore": 83.6,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;aggregated-cooking-power-team-state-weighted-slots"
      }
    },
    "330": {
      "specialty": "ingredient",
      "mechanicalScore": 67.3,
      "strategicRoleScore": 100,
      "strategicBonus": 7.7,
      "strategy": {
        "name": "沙漠蜻蜓",
        "stage": "required",
        "role": "高阶酪梨专职",
        "ingredient": "嫩亮酪梨",
        "rank": "best",
        "scorePolicy": {
          "targetFloor": 75,
          "maxBonus": 8,
          "value": 100
        },
        "reason": "当前食材手中最稳定的酪梨专职；酪梨同时进入两道1.78高系数料理。"
      },
      "score": 75,
      "source": "ingredient-mechanical-plus-strategic-role"
    },
    "334": {
      "specialty": "berry",
      "mechanicalScore": 76.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 76.3,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 42.5,
          "berryStrengthPerDay": 8159.7,
          "productionScore": 75.8,
          "rank": 28
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 57.28,
          "berryStrengthPerDay": 10996.9,
          "productionScore": 80,
          "rank": 19
        },
        "rankChangeWhenFull": 9,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "354": {
      "specialty": "berry",
      "mechanicalScore": 81.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 81.3,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 63.3,
          "berryStrengthPerDay": 9052,
          "productionScore": 84.1,
          "rank": 18
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 77.1,
          "berryStrengthPerDay": 11025.5,
          "productionScore": 80.2,
          "rank": 18
        },
        "rankChangeWhenFull": 0,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "359": {
      "specialty": "ingredient",
      "mechanicalScore": 61.2,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 61.2,
      "source": "ingredient-species-score"
    },
    "365": {
      "specialty": "berry",
      "mechanicalScore": 82.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 82.7,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 51.92,
          "berryStrengthPerDay": 9138,
          "productionScore": 84.9,
          "rank": 16
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 66.82,
          "berryStrengthPerDay": 11760.6,
          "productionScore": 85.6,
          "rank": 11
        },
        "rankChangeWhenFull": 5,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "373": {
      "specialty": "berry",
      "mechanicalScore": 97.2,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 97.2,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 56.06,
          "berryStrengthPerDay": 10763.2,
          "productionScore": 100,
          "rank": 1
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 71.59,
          "berryStrengthPerDay": 13746.1,
          "productionScore": 100,
          "rank": 1
        },
        "rankChangeWhenFull": 0,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "380": {
      "specialty": "skill",
      "mechanicalScore": 75.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 75.7,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "琥珀溪谷",
        "candidateTeam": "拉帝亚斯＋暴飞龙×4",
        "baselineTeam": "暴飞龙×5",
        "yieldCoefficient": 1.0928,
        "stabilityScore": 90,
        "operationScore": 61.6,
        "versatilityScore": 73.8,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;random-target-uniform-expectation;dynamic-energy-confirmed-brackets"
      }
    },
    "381": {
      "specialty": "skill",
      "mechanicalScore": 93.9,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 93.9,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "拉帝双龙组合归因",
        "sourceType": "latios-latias-shapley-attribution",
        "islandNameZh": "琥珀溪谷",
        "candidateTeam": "沙奈朵＋拉帝欧斯＋拉帝亚斯＋暴飞龙×2",
        "baselineTeam": "沙奈朵＋暴飞龙×4",
        "yieldCoefficient": 1.206,
        "stabilityScore": 100,
        "operationScore": 63.5,
        "versatilityScore": 59.1,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;shapley-attribution-of-latios-latias-pair-over-gardevoir-four-salamence"
      }
    },
    "389": {
      "specialty": "skill",
      "mechanicalScore": 83.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 83.7,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "灰褐洞窟",
        "candidateTeam": "土台龟＋火爆兽×4",
        "baselineTeam": "火爆兽×5",
        "yieldCoefficient": 1.1151,
        "stabilityScore": 100,
        "operationScore": 64.8,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;dynamic-energy-confirmed-brackets"
      }
    },
    "392": {
      "specialty": "skill",
      "mechanicalScore": 82.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 82.7,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "宝蓝湖畔",
        "candidateTeam": "沙奈朵＋烈焰猴＋大竺葵×3",
        "baselineTeam": "沙奈朵＋大竺葵×4",
        "yieldCoefficient": 1.1116,
        "stabilityScore": 100,
        "operationScore": 81.8,
        "versatilityScore": 73.6,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "395": {
      "specialty": "berry",
      "mechanicalScore": 86.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 86.8,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 52.12,
          "berryStrengthPerDay": 9433.8,
          "productionScore": 87.6,
          "rank": 12
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 62.65,
          "berryStrengthPerDay": 11338.7,
          "productionScore": 82.5,
          "rank": 17
        },
        "rankChangeWhenFull": -5,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "405": {
      "specialty": "ingredient",
      "mechanicalScore": 75.2,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 75.2,
      "source": "ingredient-species-score"
    },
    "426": {
      "specialty": "skill",
      "mechanicalScore": 64.1,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 64.1,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "黄金发电厂",
        "candidateTeam": "沙奈朵＋随风球＋雷丘×3",
        "baselineTeam": "沙奈朵＋雷丘×4",
        "yieldCoefficient": 1.0095,
        "stabilityScore": 75.8,
        "operationScore": 61,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "430": {
      "specialty": "skill",
      "mechanicalScore": 61.6,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 61.6,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "白花雪原",
        "candidateTeam": "沙奈朵＋乌鸦头头＋九尾（阿羅拉的樣子）×3",
        "baselineTeam": "沙奈朵＋九尾（阿羅拉的樣子）×4",
        "yieldCoefficient": 0.9905,
        "stabilityScore": 41.8,
        "operationScore": 76.2,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "442": {
      "specialty": "ingredient",
      "mechanicalScore": 63.6,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 63.6,
      "source": "ingredient-species-score"
    },
    "448": {
      "specialty": "skill",
      "mechanicalScore": 64.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 64.8,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "宝蓝湖畔",
        "candidateTeam": "沙奈朵＋路卡利欧＋大竺葵×3",
        "baselineTeam": "沙奈朵＋大竺葵×4",
        "yieldCoefficient": 1.0699,
        "stabilityScore": 100,
        "operationScore": 58.2,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;computed-standard-team"
      }
    },
    "454": {
      "specialty": "ingredient",
      "mechanicalScore": 61.6,
      "strategicRoleScore": 96,
      "strategicBonus": 8,
      "strategy": {
        "name": "毒骷蛙",
        "stage": "required",
        "role": "纯粹油专职",
        "ingredient": "纯粹油",
        "rank": "best",
        "scorePolicy": {
          "targetFloor": 70,
          "maxBonus": 8,
          "value": 96
        },
        "reason": "纯油岗位的高效率专职；纯粹油进入多道高系数料理。"
      },
      "score": 69.6,
      "source": "ingredient-mechanical-plus-strategic-role"
    },
    "460": {
      "specialty": "ingredient",
      "mechanicalScore": 72.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 72.8,
      "source": "ingredient-species-score"
    },
    "461": {
      "specialty": "berry",
      "mechanicalScore": 84.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 84.7,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 55.61,
          "berryStrengthPerDay": 9453.7,
          "productionScore": 87.8,
          "rank": 11
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 74.25,
          "berryStrengthPerDay": 12621.8,
          "productionScore": 91.8,
          "rank": 2
        },
        "rankChangeWhenFull": 9,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "462": {
      "specialty": "skill",
      "mechanicalScore": 64.4,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 64.4,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "黄金发电厂",
        "candidateTeam": "沙奈朵＋自爆磁怪＋雷丘×3",
        "baselineTeam": "沙奈朵＋雷丘×4",
        "yieldCoefficient": 0.9688,
        "stabilityScore": 100,
        "operationScore": 80,
        "versatilityScore": 69.8,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;aggregated-cooking-power-team-state-weighted-slots"
      }
    },
    "468": {
      "specialty": "skill",
      "mechanicalScore": 55.1,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 55.1,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "天青沙滩",
        "candidateTeam": "沙奈朵＋波克基斯＋大力鱷×3",
        "baselineTeam": "沙奈朵＋大力鱷×4",
        "yieldCoefficient": 1.0258,
        "stabilityScore": 14.6,
        "operationScore": 72.2,
        "versatilityScore": 91,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;computed-standard-team"
      }
    },
    "470": {
      "specialty": "skill",
      "mechanicalScore": 55.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 55.3,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "宝蓝湖畔",
        "candidateTeam": "叶伊布＋大竺葵×4",
        "baselineTeam": "大竺葵×5",
        "yieldCoefficient": 1.0192,
        "stabilityScore": 80,
        "operationScore": 50.4,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;random-target-uniform-expectation;dynamic-energy-confirmed-brackets"
      }
    },
    "471": {
      "specialty": "skill",
      "mechanicalScore": 62.5,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 62.5,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "白花雪原",
        "candidateTeam": "沙奈朵＋冰伊布＋九尾（阿羅拉的樣子）×3",
        "baselineTeam": "沙奈朵＋九尾（阿羅拉的樣子）×4",
        "yieldCoefficient": 0.9377,
        "stabilityScore": 100,
        "operationScore": 67.3,
        "versatilityScore": 69.8,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;aggregated-cooking-power-team-state-weighted-slots"
      }
    },
    "475": {
      "specialty": "skill",
      "mechanicalScore": 64.4,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 64.4,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "宝蓝湖畔",
        "candidateTeam": "沙奈朵＋艾路雷朵＋大竺葵×3",
        "baselineTeam": "沙奈朵＋大竺葵×4",
        "yieldCoefficient": 1.0115,
        "stabilityScore": 54.5,
        "operationScore": 78.9,
        "versatilityScore": 77.1,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "488": {
      "specialty": "skill",
      "mechanicalScore": 92.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 92.3,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "宝蓝湖畔",
        "candidateTeam": "克雷色利亚＋大竺葵×4",
        "baselineTeam": "大竺葵×5",
        "yieldCoefficient": 1.1992,
        "stabilityScore": 100,
        "operationScore": 52.5,
        "versatilityScore": 60.7,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;dynamic-energy-confirmed-brackets"
      }
    },
    "491": {
      "specialty": "all",
      "score": null,
      "source": "pending-all-rounder-formula"
    },
    "518": {
      "specialty": "berry",
      "mechanicalScore": 73.5,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 73.5,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 58.13,
          "berryStrengthPerDay": 8313.2,
          "productionScore": 77.2,
          "rank": 26
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 71.59,
          "berryStrengthPerDay": 10238,
          "productionScore": 74.5,
          "rank": 29
        },
        "rankChangeWhenFull": -3,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "558": {
      "specialty": "skill",
      "mechanicalScore": 73.5,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 73.5,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "琥珀溪谷",
        "candidateTeam": "沙奈朵＋岩殿居蟹＋暴飛龍×3",
        "baselineTeam": "沙奈朵＋暴飛龍×4",
        "yieldCoefficient": 0.9266,
        "stabilityScore": 89.2,
        "operationScore": 68.3,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;aggregated-cooking-power-team-state-weighted-slots"
      }
    },
    "628": {
      "specialty": "skill",
      "mechanicalScore": 77.2,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 77.2,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "天青沙滩",
        "candidateTeam": "沙奈朵＋勇士雄鹰＋大力鱷×3",
        "baselineTeam": "沙奈朵＋大力鱷×4",
        "yieldCoefficient": 1.1047,
        "stabilityScore": 100,
        "operationScore": 70,
        "versatilityScore": 73.5,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;computed-standard-team"
      }
    },
    "697": {
      "specialty": "berry",
      "mechanicalScore": 87.6,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 87.6,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 58.85,
          "berryStrengthPerDay": 9710.3,
          "productionScore": 90.2,
          "rank": 7
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 71.59,
          "berryStrengthPerDay": 11813.1,
          "productionScore": 85.9,
          "rank": 10
        },
        "rankChangeWhenFull": -3,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "700": {
      "specialty": "skill",
      "mechanicalScore": 78.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 78.7,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "天青沙滩",
        "candidateTeam": "仙子伊布＋大力鳄×4",
        "baselineTeam": "大力鳄×5",
        "yieldCoefficient": 1.0958,
        "stabilityScore": 100,
        "operationScore": 52.2,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;dynamic-energy-confirmed-brackets"
      }
    },
    "701": {
      "specialty": "skill",
      "mechanicalScore": 61.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 61.7,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "天青沙滩",
        "candidateTeam": "沙奈朵＋摔角鹰人＋大力鱷×3",
        "baselineTeam": "沙奈朵＋大力鱷×4",
        "yieldCoefficient": 0.9631,
        "stabilityScore": 90.4,
        "operationScore": 54.1,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "702": {
      "specialty": "skill",
      "mechanicalScore": 89.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 89.8,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "黄金发电厂",
        "candidateTeam": "沙奈朵＋咚咚鼠＋雷丘×3",
        "baselineTeam": "沙奈朵＋雷丘×4",
        "yieldCoefficient": 1.1675,
        "stabilityScore": 98.9,
        "operationScore": 69,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;aggregated-tasty-chance-team-state"
      }
    },
    "715": {
      "specialty": "skill",
      "mechanicalScore": 74.5,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 74.5,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "琥珀溪谷",
        "candidateTeam": "沙奈朵＋音波龙＋暴飛龍×3",
        "baselineTeam": "沙奈朵＋暴飛龍×4",
        "yieldCoefficient": 1.0015,
        "stabilityScore": 100,
        "operationScore": 74,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;aggregated-cooking-power-team-state-weighted-slots"
      }
    },
    "738": {
      "specialty": "ingredient",
      "mechanicalScore": 71.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 71.7,
      "source": "ingredient-species-score"
    },
    "743": {
      "specialty": "ingredient",
      "mechanicalScore": 72.7,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 72.7,
      "source": "ingredient-species-score"
    },
    "760": {
      "specialty": "ingredient",
      "mechanicalScore": 75.4,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": {
        "name": "穿着熊",
        "stage": "required",
        "role": "萌绿玉米专职",
        "ingredient": "萌绿玉米",
        "rank": "primary",
        "reason": "玉米长期岗位；当前机械分已能表达其基础价值，不额外加分。"
      },
      "score": 75.4,
      "source": "ingredient-species-score"
    },
    "764": {
      "specialty": "ingredient",
      "mechanicalScore": 64.1,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 64.1,
      "source": "ingredient-species-score"
    },
    "777": {
      "specialty": "skill",
      "mechanicalScore": 61.2,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 61.2,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "黄金发电厂",
        "candidateTeam": "托戈德玛尔＋雷丘×4",
        "baselineTeam": "雷丘×5",
        "yieldCoefficient": 1.0158,
        "stabilityScore": 52.4,
        "operationScore": 44.4,
        "versatilityScore": 83.8,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;random-target-uniform-expectation;nuzzle-one-generation-bonus;dynamic-energy-confirmed-brackets"
      }
    },
    "778": {
      "specialty": "skill",
      "mechanicalScore": 73.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 73.8,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "黄金发电厂",
        "candidateTeam": "沙奈朵＋谜拟丘＋雷丘×3",
        "baselineTeam": "沙奈朵＋雷丘×4",
        "yieldCoefficient": 1.1012,
        "stabilityScore": 74,
        "operationScore": 62.3,
        "versatilityScore": 73.3,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;computed-standard-team"
      }
    },
    "780": {
      "specialty": "ingredient",
      "mechanicalScore": 72.9,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 72.9,
      "source": "ingredient-species-score"
    },
    "845": {
      "specialty": "ingredient",
      "mechanicalScore": 58.4,
      "strategicRoleScore": 78,
      "strategicBonus": 5.6,
      "strategy": {
        "name": "古月鸟",
        "stage": "optional",
        "role": "纯油兼料理功能",
        "ingredient": "纯粹油",
        "rank": "alternative",
        "scorePolicy": {
          "targetFloor": 64,
          "maxBonus": 6,
          "value": 78
        },
        "reason": "机械食材底盘偏低，但同时补纯油与料理功能，不能只按AAA基础产量判断。"
      },
      "score": 64,
      "source": "ingredient-mechanical-plus-strategic-role"
    },
    "849": {
      "specialty": "skill",
      "mechanicalScore": 61.6,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 61.6,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "琥珀溪谷",
        "candidateTeam": "沙奈朵＋颤弦蝾螈（高调的样子）＋暴飛龍×3",
        "baselineTeam": "沙奈朵＋暴飛龍×4",
        "yieldCoefficient": 0.9419,
        "stabilityScore": 77.9,
        "operationScore": 74.7,
        "versatilityScore": 65.5,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;aggregated-cooking-power-team-state-weighted-slots"
      }
    },
    "908": {
      "specialty": "ingredient",
      "mechanicalScore": 69.9,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": {
        "name": "魔幻假面喵",
        "stage": "forming",
        "role": "窝心洋芋专职",
        "ingredient": "窝心洋芋",
        "rank": "primary",
        "reason": "土豆岗位明确，但现有机械种族分已经处于可培养区间，不额外补正。"
      },
      "score": 69.9,
      "source": "ingredient-species-score"
    },
    "911": {
      "specialty": "ingredient",
      "mechanicalScore": 83,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 83,
      "source": "ingredient-species-score"
    },
    "914": {
      "specialty": "ingredient",
      "mechanicalScore": 75.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": {
        "name": "狂欢浪舞鸭",
        "stage": "required",
        "role": "萌绿大豆替代",
        "ingredient": "萌绿大豆",
        "rank": "alternative",
        "reason": "大豆替代供给路线。"
      },
      "score": 75.3,
      "source": "ingredient-species-score"
    },
    "923": {
      "specialty": "skill",
      "mechanicalScore": 81.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 81.8,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "回复位",
        "sourceType": "dynamic-healer-team",
        "islandNameZh": "黄金发电厂",
        "candidateTeam": "巴布土拨＋雷丘×4",
        "baselineTeam": "雷丘×5",
        "yieldCoefficient": 1.1204,
        "stabilityScore": 100,
        "operationScore": 59.4,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;dynamic-energy-confirmed-brackets"
      }
    },
    "959": {
      "specialty": "berry",
      "mechanicalScore": 88.1,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 88.1,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 68.07,
          "berryStrengthPerDay": 9734.6,
          "productionScore": 90.4,
          "rank": 5
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 83.53,
          "berryStrengthPerDay": 11944.3,
          "productionScore": 86.9,
          "rank": 8
        },
        "rankChangeWhenFull": -3,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "975": {
      "specialty": "ingredient",
      "mechanicalScore": 71.5,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": {
        "name": "浩大鲸",
        "stage": "forming",
        "role": "窝心洋芋替代",
        "ingredient": "窝心洋芋",
        "rank": "alternative",
        "reason": "土豆替代路线；现有机械种族分已经足够，不额外补正。"
      },
      "score": 71.5,
      "source": "ingredient-species-score"
    },
    "980": {
      "specialty": "ingredient",
      "mechanicalScore": 64,
      "strategicRoleScore": 76,
      "strategicBonus": 4,
      "strategy": {
        "name": "土王",
        "stage": "required",
        "role": "可可替代专职",
        "ingredient": "放松可可",
        "rank": "alternative",
        "scorePolicy": {
          "targetFloor": 68,
          "maxBonus": 4,
          "value": 76
        },
        "reason": "水箭龟之外的可可覆盖位，适合补齐高系数点心的可可缺口。"
      },
      "score": 68,
      "source": "ingredient-mechanical-plus-strategic-role"
    },
    "7007": {
      "specialty": "berry",
      "mechanicalScore": 85.1,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 85.1,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 53.09,
          "berryStrengthPerDay": 9343.6,
          "productionScore": 86.8,
          "rank": 14
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 69.13,
          "berryStrengthPerDay": 12166.1,
          "productionScore": 88.5,
          "rank": 6
        },
        "rankChangeWhenFull": 8,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "8001": {
      "specialty": "skill",
      "mechanicalScore": 62.9,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 62.9,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "琥珀溪谷",
        "candidateTeam": "沙奈朵＋颤弦蝾螈（低调的样子）＋暴飛龍×3",
        "baselineTeam": "沙奈朵＋暴飛龍×4",
        "yieldCoefficient": 0.9288,
        "stabilityScore": 95.4,
        "operationScore": 72,
        "versatilityScore": 76.4,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;aggregated-cooking-power-team-state-weighted-slots"
      }
    },
    "9002": {
      "specialty": "skill",
      "mechanicalScore": 55.8,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 55.8,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "黄金发电厂",
        "candidateTeam": "沙奈朵＋皮卡丘（佳节）＋雷丘×3",
        "baselineTeam": "沙奈朵＋雷丘×4",
        "yieldCoefficient": 1.0209,
        "stabilityScore": 100,
        "operationScore": 62.1,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;computed-standard-team"
      }
    },
    "9004": {
      "specialty": "berry",
      "mechanicalScore": 72.9,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 72.9,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 54.58,
          "berryStrengthPerDay": 8405,
          "productionScore": 78.1,
          "rank": 25
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 64.67,
          "berryStrengthPerDay": 9958.5,
          "productionScore": 72.4,
          "rank": 30
        },
        "rankChangeWhenFull": -5,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "9005": {
      "specialty": "skill",
      "mechanicalScore": 61,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 61,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "白花雪原",
        "candidateTeam": "沙奈朵＋伊布（万圣节）＋九尾（阿羅拉的樣子）×3",
        "baselineTeam": "沙奈朵＋九尾（阿羅拉的樣子）×4",
        "yieldCoefficient": 0.9459,
        "stabilityScore": 66.3,
        "operationScore": 65.1,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;computed-standard-team"
      }
    },
    "9006": {
      "specialty": "skill",
      "mechanicalScore": 79.1,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 79.1,
      "source": "team-calibrated-final-species-score",
      "teamModel": {
        "role": "额外技能位",
        "sourceType": "ordinary-fixed-team",
        "islandNameZh": "白花雪原",
        "candidateTeam": "沙奈朵＋海豹球（佳节）＋九尾（阿羅拉的樣子）×3",
        "baselineTeam": "沙奈朵＋九尾（阿羅拉的樣子）×4",
        "yieldCoefficient": 1.1146,
        "stabilityScore": 98.2,
        "operationScore": 77.8,
        "versatilityScore": 100,
        "scoringStatus": "team-yield-coefficient-normalized-above-one;main-skill-70-10-10-10;species-95-5;skill-role-gap-compensation-0.5;user-manual-species-adjustment;aggregated-tasty-chance-team-state"
      }
    },
    "9007": {
      "specialty": "berry",
      "mechanicalScore": 81,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 81,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 66.15,
          "berryStrengthPerDay": 9063,
          "productionScore": 84.2,
          "rank": 17
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 80.19,
          "berryStrengthPerDay": 10985.4,
          "productionScore": 79.9,
          "rank": 22
        },
        "rankChangeWhenFull": -5,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "711-4": {
      "specialty": "ingredient",
      "mechanicalScore": 56.3,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 56.3,
      "source": "ingredient-species-score"
    },
    "711-3": {
      "specialty": "ingredient",
      "mechanicalScore": 55.6,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 55.6,
      "source": "ingredient-species-score"
    },
    "711-2": {
      "specialty": "ingredient",
      "mechanicalScore": 55.2,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 55.2,
      "source": "ingredient-species-score"
    },
    "711-1": {
      "specialty": "ingredient",
      "mechanicalScore": 55.2,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 55.2,
      "source": "ingredient-species-score"
    },
    "9001-1": {
      "specialty": "berry",
      "mechanicalScore": 76.6,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 76.6,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 62.71,
          "berryStrengthPerDay": 8590.6,
          "productionScore": 79.8,
          "rank": 20
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 80.19,
          "berryStrengthPerDay": 10985.4,
          "productionScore": 79.9,
          "rank": 20
        },
        "rankChangeWhenFull": 0,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    },
    "9001-2": {
      "specialty": "berry",
      "mechanicalScore": 76.6,
      "strategicRoleScore": null,
      "strategicBonus": 0,
      "strategy": null,
      "score": 76.6,
      "source": "berry-species-score",
      "scenarios": {
        "status": "confirmed-separate-species-baselines",
        "targetLevel": 70,
        "normalCollection": {
          "berryCountPerDay": 62.71,
          "berryStrengthPerDay": 8590.6,
          "productionScore": 79.8,
          "rank": 21
        },
        "fullBagSneakySnacking": {
          "berryCountPerDay": 80.19,
          "berryStrengthPerDay": 10985.4,
          "productionScore": 79.9,
          "rank": 21
        },
        "rankChangeWhenFull": 0,
        "scope": "Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output"
      }
    }
  },
  "existingNameTargets": {
    "巴大蝶": {
      "id": "12",
      "name": "巴大蝶"
    },
    "冰伊布": {
      "id": "471",
      "name": "冰伊布"
    },
    "波克基斯": {
      "id": "468",
      "name": "波克基斯"
    },
    "草苗龟": {
      "id": "389",
      "name": "土台龟"
    },
    "达克莱伊": {
      "id": "491",
      "name": "达克莱伊"
    },
    "大葱鸭": {
      "id": "83",
      "name": "大葱鸭"
    },
    "大食花": {
      "id": "71",
      "name": "大食花"
    },
    "呆呆王": {
      "id": "199",
      "name": "呆呆王"
    },
    "戴鲁比": {
      "id": "229",
      "name": "黑鲁加"
    },
    "帝牙海狮": {
      "id": "365",
      "name": "帝牙海狮"
    },
    "电龙": {
      "id": "181",
      "name": "电龙"
    },
    "咚咚鼠": {
      "id": "702",
      "name": "咚咚鼠"
    },
    "风速狗": {
      "id": "59",
      "name": "风速狗"
    },
    "古月鸟": {
      "id": "845",
      "name": "古月鸟"
    },
    "骨纹巨声鳄": {
      "id": "911",
      "name": "骨纹巨声鳄"
    },
    "鬼斯": {
      "id": "94",
      "name": "耿鬼"
    },
    "果然翁": {
      "id": "202",
      "name": "果然翁"
    },
    "海豹球": {
      "id": "365",
      "name": "帝牙海狮"
    },
    "海豹球（节日）": {
      "id": "9006",
      "name": "海豹球（佳节）"
    },
    "猴怪": {
      "id": "57",
      "name": "火暴猴"
    },
    "花疗环环": {
      "id": "764",
      "name": "花疗环环"
    },
    "火爆兽": {
      "id": "157",
      "name": "火爆兽"
    },
    "火稚鸡": {
      "id": "257",
      "name": "火焰鸡"
    },
    "杰尼龟": {
      "id": "9",
      "name": "水箭龟"
    },
    "卡拉卡拉": {
      "id": "105",
      "name": "嘎啦嘎啦"
    },
    "凯罗斯": {
      "id": "127",
      "name": "凯罗斯"
    },
    "可达鸭": {
      "id": "55",
      "name": "哥达鸭"
    },
    "可可多拉": {
      "id": "306",
      "name": "波士可多拉"
    },
    "克雷色利亚": {
      "id": "488",
      "name": "克雷色利亚"
    },
    "快龙": {
      "id": "149",
      "name": "快龙"
    },
    "拉达": {
      "id": "20",
      "name": "拉达"
    },
    "拉帝欧斯": {
      "id": "381",
      "name": "拉帝欧斯"
    },
    "拉帝亚斯": {
      "id": "380",
      "name": "拉帝亚斯"
    },
    "蓝鳄": {
      "id": "160",
      "name": "大力鳄"
    },
    "雷公": {
      "id": "243",
      "name": "雷公"
    },
    "雷丘": {
      "id": "26",
      "name": "雷丘"
    },
    "隆隆岩": {
      "id": "76",
      "name": "隆隆岩"
    },
    "玛狃拉": {
      "id": "461",
      "name": "玛狃拉"
    },
    "毛头小鹰": {
      "id": "628",
      "name": "勇士雄鹰"
    },
    "梦幻": {
      "id": "151",
      "name": "梦幻"
    },
    "妙蛙花": {
      "id": "3",
      "name": "妙蛙花"
    },
    "魔墙人偶": {
      "id": "122",
      "name": "魔墙人偶"
    },
    "胖丁": {
      "id": "40",
      "name": "胖可丁"
    },
    "胖可丁": {
      "id": "40",
      "name": "胖可丁"
    },
    "皮宝宝": {
      "id": "36",
      "name": "皮可西"
    },
    "皮卡丘（圣诞）": {
      "id": "9002",
      "name": "皮卡丘（佳节）"
    },
    "皮卡丘（巫师帽）": {
      "id": "9001-1",
      "name": "皮卡丘（巫师帽）"
    },
    "飘飘球": {
      "id": "426",
      "name": "随风球"
    },
    "七夕青鸟": {
      "id": "334",
      "name": "七夕青鸟"
    },
    "奇鲁莉安": {
      "id": "282",
      "name": "沙奈朵"
    },
    "三合一磁怪": {
      "id": "462",
      "name": "自爆磁怪"
    },
    "森林蜥蜴": {
      "id": "254",
      "name": "蜥蜴王"
    },
    "沙基拉斯": {
      "id": "248",
      "name": "班基拉斯"
    },
    "沙漠蜻蜓": {
      "id": "330",
      "name": "沙漠蜻蜓"
    },
    "沙奈朵": {
      "id": "282",
      "name": "沙奈朵"
    },
    "树才怪": {
      "id": "185",
      "name": "树才怪"
    },
    "摔角鹰人": {
      "id": "701",
      "name": "摔角鹰人"
    },
    "水箭龟": {
      "id": "9",
      "name": "水箭龟"
    },
    "水君": {
      "id": "245",
      "name": "水君"
    },
    "水伊布": {
      "id": "134",
      "name": "水伊布"
    },
    "太阳伊布": {
      "id": "196",
      "name": "太阳伊布"
    },
    "童偶熊": {
      "id": "760",
      "name": "穿着熊"
    },
    "吞食兽": {
      "id": "317",
      "name": "吞食兽"
    },
    "乌波（城都）": {
      "id": "195",
      "name": "沼王"
    },
    "乌波（帕底亚）": {
      "id": "980",
      "name": "土王"
    },
    "蜥蜴王": {
      "id": "254",
      "name": "蜥蜴王"
    },
    "仙子伊布": {
      "id": "700",
      "name": "仙子伊布"
    },
    "小磁怪": {
      "id": "462",
      "name": "自爆磁怪"
    },
    "雪笠怪": {
      "id": "460",
      "name": "暴雪王"
    },
    "炎帝": {
      "id": "244",
      "name": "炎帝"
    },
    "伊布（圣诞）": {
      "id": "9004",
      "name": "伊布（佳节）"
    },
    "伊布（万圣节）": {
      "id": "9005",
      "name": "伊布（万圣节）"
    },
    "勇士雄鹰": {
      "id": "628",
      "name": "勇士雄鹰"
    },
    "幼基拉斯": {
      "id": "248",
      "name": "班基拉斯"
    },
    "沼跃鱼": {
      "id": "260",
      "name": "巨沼怪"
    },
    "自爆磁怪": {
      "id": "462",
      "name": "自爆磁怪"
    }
  }
});
});
