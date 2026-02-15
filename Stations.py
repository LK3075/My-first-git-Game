#My Guess The Station Game!

import json
import random



with open("stat.json", "r", encoding="utf-8") as f:
    stations = json.load(f)

print(len(stations))


operator_key = {
    "TFW": "Transport For Wales",
    "C2C": "C2C",
    "CH": "Chiltern Railways",
    "EMR": "East Midlands Railway",
    "GC": "Grand Central",
    "GN": "Great Northern",
    "LNER": "LNER",
    "GWR": "Great Western Railway",
    "GX": "Gatwick Express",
    "HT": "Hull Trains",
    "LUMO": "LUMO",
    "WMT": "West Midlands Railway",
    "TFL": "Transport For London",
    "MER": "Mersyrail",
    "NT": "Northern",
    "SER": "South Eastern Railway",
    "SN": "Southern",
    "SCR": "Scotrail",
    "SWR": "South Western Railway",
    "TL": "Thamslink",
    "TPE": "Transpennine Express",
    "AWC": "Avanti West Coast",
    "XC": "Cross Country ",
    "TWM": "Tyne and Wear Metro",
    "GA": "Greater Anglia"
}

country_key = {
    "SE": "South East England",
    "SW":"South West England",
    "EA":"East Anglia",
    "EM":"East Midlands",
    "WM":"West Midlands",
    "NE":"North East England",
    "NW":"North West England",
    "YH":"Yorkshire and Humber",
    "LON":"London",
    "W": "Wales",
    "S": "Scotland",
}

fun_key ={
    "word":"This station has more than one word in its name",
    "term":"Services can often terminate here",
    "thro":"This station has through lines",
    "dep": "This station is near depot",
    "jnc":"Services can branch off the line after departing before reaching another station",
    "int":"This station is a common interchange for other services/transport",
    "sea":"This station is near the seaside",
    "fut":"This station is near a stadium",
    "air":"This station is near an airport",
    "uni":"This station is near a university",
    "park":"This is a parkway station",
    "spa":"This is a spa station",
    "town":"This station serves a town/village",
    "city":"This station serves part of/all of a large town/city",
}



start_messages = [
    'Give it your best shot..',
    'How sharp is your railway knowledge?',
    'How many can you get?',
    'Can YOU name the UK railway station?',
    'Let the game begin...',
    'Lets hope you stay on "track"...'
    ]
guess_prompts = [
    'Give it your best shot..:',
    'Give it a go..:',
    'Your answer?:',
    'What do you think?:',
    'Any ideas?:',
    'Your guess..:',
    'Take a guess:',
    'Wanna try your luck?:',
    'Whats your best guess?:',
]
correct_messages = [
    'Good Job!',
    'Well done!',
    'Thats Right!',
    'Thats Correct!',
    'Correct Asnwer!',
    'You got it!',
    'Nice!',
    'Nice Job!',
    'Good Work!',
    'Correct. Well done!',
    'Spot on!',
    'Thats the right answer!',
    'You figured it out!',
]
incorrect_messages = [
    'Not quite...',
    'Nope',
    'Incorrect...',
]
guessed_wrong = [
    "Not Quite... the answer was: {}",
    "Better luck next time. It was: {}",
    "Whoops... The Correct answer was: {}",
    "Round over! The answer was: {}",
]


total_score = 0
rounds = 5
starting_clues = 4
max_guesses = 10

print(f'\nGuess the UK Train Station!')
print(random.choice(start_messages))


for round_number in range(1, rounds + 1):
    print(f'\n====== Round {round_number} ======')
    guesses = 0


    station = random.choice(stations)
    stations.remove(station)

    full_ops = [operator_key.get(op, op) for op in station["operators"]]
    country = country_key.get(station["country"],station["country"])

    Clues = [
    f"Region: {country}",
    f"Number of Platforms: {station['platforms']}",
    f"Operators: {', '.join(full_ops)}",
    f"Passing services regularly: {station['passing services regularly']}",
    f"has terminus platforms: {station['has terminus platforms']}",


    ]

    for i in range(1, 10):
        key =  f"Extra Fact{i}"
        if key in station and station[key] !="":
            fact_code = station[key]
            fact_text = fun_key.get(fact_code,fact_code)
            Clues.append(f"Fun Fact: {fact_text}")

    random.shuffle(Clues)
    clues_to_show = starting_clues
 
    print('Guess The Station!')
    print('Here are your clues...')

    guessed_correctly = False

    while guesses < max_guesses:
        print('\nClues so Far:')
        for i in range(min(clues_to_show, len(Clues))):
            print('-', Clues[i])

        guess = input(random.choice(guess_prompts))
        guesses += 1

        if guess.lower() == station['name'].lower():
          guessed_correctly = True
          clues_used = clues_to_show
          points = len(Clues) - clues_used + 1
          total_score += points
          print(random.choice(correct_messages))
          print(f'\nYou Scored {points} points!')
          print(f'\nTotal Score: {total_score}')
          break

        else:
          print('Incorrect...')
          if clues_to_show < len(Clues):
             clues_to_show += 1

    if not guessed_correctly:
        print(random.choice(guessed_wrong).format(station['name']))


else:
        print(f'\nGame Over!')
        print(f'Total Score: {total_score}')





























