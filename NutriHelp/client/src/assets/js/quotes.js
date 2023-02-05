const _quotes = [
    {
        quote: "Strength does not come from physical capacity. It comes from an indomitable will.",
        author: "Mahatma Gandhi"
    },
    {
        quote: "Success usually comes to those who are too busy to be looking for it.",
        author: "Henry David Thoreau"
    },
    {
        quote: "If you want something you've never had, you must be willing to do something you've never done.",
        author: "Thomas Jefferson"
    },
    {
        quote: "Thomas Jefferson",
        author: "Unknown"
    },
    {
        quote: "Once you are exercising regularly, the hardest thing is to stop it.",
        author: "Erin Gray"
    },
    {
        quote: "If you don't make time for exercise, you'll probably have to make time for illness.",
        author: "Robin Sharma"
    },
    {
        quote: "Dead last finish is greater than did not finish, which trumps did not start.",
        author: "Unknown"
    },
    {
        quote: "The best way to predict the future is to create it.",
        author: "Abraham Lincoln"
    },
    {
        quote: "Rome wasn't built in a day, but they worked on it every single day.",
        author: "Unknown"
    },
    {
        quote: "All progress takes place outside the comfort zone.",
        author: "Michael John Bobak"
    },
    {
        quote: "Your body can stand almost anything. It's your mind that you have to convince.",
        author: "Unknown"
    },
    {
        quote: "What seems impossible today will one day become your warm-up.",
        author: "Unknown"
    },
    {
        quote: "Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway.",
        author: "Earl Nightingale"
    },
    {
        quote: "I don't count my sit-ups. I only start counting when it starts hurting because they're the only ones that count.",
        author: "Muhammad Ali"
    },
    {
        quote: "Go the extra mile. It's never crowded.",
        author: "Wayne Dyer"
    },
    {
        quote: "If you change the way you look at things, the things you look at change.",
        author: "Unknown"
    },
    {
        quote: "You just can't beat the person who never gives up.",
        author: "Babe Ruth"
    },
    {
        quote: "Take care of your body. It's the only place you have to live.",
        author: "Jim Rohn"
    },
    {
        quote: "Do something today that your future self will thank you for.",
        author: "Sean Patrick Flanery"
    },
    {
        quote: "You did not wake up today to be mediocre.",
        author: "Unknown"
    },
    {
        quote: "Push harder than yesterday if you want a different tomorrow.",
        author: "Unknown"
    },
    {
        quote: "Success is usually the culmination of controlling failure.",
        author: "Sly Stallone"
    },
    {
        quote: "Your health account, your bank account, they're the same thing. The more you put in, the more you can take out.",
        author: "Jack LaLanne"
    },
    {
        quote: "Don't say I can't. Say, I presently struggle with.",
        author: "Tony Horton"
    },
    {
        quote: "Motivation is what gets you started. Habit is what keeps you going.",
        author: "Jim Ryun"
    },
    {
        quote: "We are what we repeatedly do. Excellence then is not an act but a habit.",
        author: "Aristotle"
    },
    {
        quote: "Your body can stand almost anything. It's your mind that you have to convince.",
        author: "Andrew Murphy"
    },
    {
        quote: "Nobody who ever gave his best regretted it.",
        author: "George Halas"
    },
    {
        quote: "There are two types of pain in this world: pain that hurts you, and pain that changes you.",
        author: "Unknown"
    },
    {
        quote: "Ability is what you're capable of doing. Motivation determines what you do. Attitude determines how well you do it.",
        author: "Lou Holtz"
    },
    {
        quote: "When you hit failure, your workout has just begun.",
        author: "Ronnie Coleman"
    },
    {
        quote: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        quote: "You can either suffer the pain of discipline or the pain of regret.",
        author: "Jim Rohn"
    },
    {
        quote: "I hated every minute of training, but I said, Don't quit. Suffer now and live the rest of your life as a champion.",
        author: "Muhammad Ali"
    },
    {
        quote: "No matter how slow you go you're still lapping everyone on the couch.",
        author: "Unknown"
    },
    {
        quote: "To keep the body in good health is a duty… otherwise we shall not be able to keep our mind strong and clear.",
        author: "Buddha"
    },
    {
        quote: "When it comes to eating right and exercising, there is no I'll start tomorrow.",
        author: "VL Allineare"
    },
    {
        quote: "We do not stop exercising because we grow old- we grow old because we stop exercising.",
        author: "Dr. Kenneth Cooper"
    },
    {
        quote: "It never gets easier, you just get better.",
        author: "Unknown"
    },
    {
        quote: "The gym is not the social club for the fit. It's a training ground for everyone.",
        author: "Unknown"
    },
    {
        quote: "The mind is the most important part of achieving any fitness goal. Mental change always comes before physical change.",
        author: "Matt McGorry"
    },
    {
        quote: "It always seems impossible until it is done.",
        author: "Nelson Mandela"
    },
    {
        quote: "You don't have to be good at it, you just have to do it.",
        author: "Karine Candice Kong"
    },
    {
        quote: "You have to push past your perceived limits, push past that point you thought was as far as you can go.",
        author: "Drew Brees"
    },
    {
        quote: "In training, you listen to your body. In competition, you tell your body to shut up.",
        author: "Rich Froning Jr."
    },
    {
        quote: "I will beat her. I will train harder. I will eat cleaner. I know her strengths. I've lost to her before but not this time. She is going down. I have the advantage because I know her well. She is the old me",
        author: "Unknown"
    },
    {
        quote: "Good things come to those who sweat.",
        author: "Unknown"
    },
    {
        quote: "You're going to have to let it hurt. Let it suck. The harder you work, the better you will look. Your appearance isn't parallel to how heavy you lift, it's parallel to how hard you work.",
        author: "Joe Mangianello"
    },
    {
        quote: "Don't limit your challenges. Challenge your limits.",
        author: "Jerry Dunn"
    },
    {
        quote: "Believe in yourself and all that you are. Know that there is something inside of you that is greater than any obstacle.",
        author: "Christian D. Larson"
    }
]

function randomQuote() {
    const i = Math.ceil(Math.random() * 49)

    return (
        <>
            <q>{_quotes[i].quote}</q>
            <p>-{_quotes[i].author}</p>
        </>
    )
}

export default randomQuote
