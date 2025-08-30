# Mastering Reinforcement Learning: How Machines Learn from Rewards and Mistakes

Publish: 2024-12-10

Author: Leonard Christopher Limanjaya

Medium: [link](https://leonardcl.medium.com/mastering-reinforcement-learning-how-machines-learn-from-rewards-and-mistakes-dcbaa0fa3e5c)

---
## What is Reinforcement Learning
Have you heard about Artificial Intelligence and Machine Learning? If so, you’re on the right track. Machine Learning has three major subfields:
- Supervised Learning
- Unsupervised Learning
- Reinforcement Learning

First of all, Reinforcement Learning is an area of Machine Learning, but what makes it stand out form the others? To understand that, we first need to quickly go over Supervised Learning and Unsupervised Learning. 

Imagine you’re teaching a friend how to solve math problems. You give them a set of practice problems along with the correct answers. Over time, your friend gets better at solving similar problems on their own because they learn from the examples you provided.

**Supervised Learning** works in a similar way, it's like teaching a model with **examples**—imagine giving a program tons of data along with the right answers, and the model learns to make predictions based on what it's seen. For instance, if you want a program to recognize real or fame money, you first show it lots of examples of images labeled as "real" or "fake". The model then learns to tell the difference when it sees the images. 

On the other hand, there's a twist on **Unsupervised Learning**—there are **no labels or right answers**. Imagine you’re given a pile of puzzle pieces but without a picture to guide you. You’d have to figure out how the pieces fit together on your own, just by finding patterns.

In Unsupervised Learning, the model does something similar. It tries to figure things out on its own by finding patterns in the data. This is useful for things like grouping similar items together. For example, if you have a bunch of customer data, an unsupervised model might group customers with similar buying habits without knowing anything about them beforehand. An unsupervised model could uncover hidden trends and group customers with similar buying habits without any prior guidance!

Now we talk about **Reinforcement Learning** (RL), how RL learns is completely different with the first two. RL is like teaching a model through trial and error. Instead of giving it correct answers upfront, you let the model learn by making decisions in an environment and then rewarding or punishing it based on how well it does. Over time, the model tries to make better choices to maximizes its reward. 

To put it simply, the main idea behind Reinforcement Learning is that the agent (an AI model) learns by taking actions and interacting with its environment, receiving rewards as feedback for those actions. This learning method is similar to how we humans learn—from our experiences.

To have deeper understanding, let's break it down with a simple example. Imagine that your are teaching our little sister to ride a bike, she's never done it before. you give her a bike and let her figure it out by herself. 

Your sister will interact with the bike and surrounding by pedaling or steering the wheel as action. 

<center><img class="h-48 w-96" src="/1-rl-fundamental/ride_bike.png" alt="ride_bike"></center>

As she interacts with the bike by pedaling and steering, you decide to give her a reward—a dollar—every time she successfully rides a meter without losing her balance. Each smooth meter earns her one dollar (+1 reward), motivating her to keep trying and stay balanced, with a clear goal: to collect dollars as many as possible by riding well.

<center><img src="/1-rl-fundamental/get_money.png" alt="get_money"></center>

However, if she loses her balance and falls, she receives a -1 (negative reward). This negative feedback discourages her from actions that lead to falling.

<center><img src="/1-rl-fundamental/fall.png" alt="fall"></center>


This setup mirrors how reinforcement learning works. Your sister, like an AI model, learns through trial and error, adjusting her actions to maximize her rewards—riding smoothly to earn dollars and avoiding falls to prevent losing points. Without any direct supervision, she can gradually improve her skills through interaction and feedback. This is similar to how humans and even animals learn by interacting with their environment.

In Reinforcement Learning terms, your sister is the **agent**, the bike and the surroundings are the **environment**, and the **actions** she takes—pedaling, steering—are her choices. The rewards (dollars) and penalties (falling) form what’s called a **reward function**. This reward function guides the agent (your sister) toward her goal: riding the bike smoothly and collecting as many dollars as possible.

## A Formal Definition

<center><img src="/1-rl-fundamental/rl_ps.png" alt="rl_ps"></center>

Now, because you already have a picture about how Reinforcement Learning, lets dive deeper and learn about the formal definition of Reinforcement Learning.

> <b>Formal Definition</b> </br>
> Reinforcement Learning is a framework for solving control tasks (also known as decision problems) by creating **agents that learn from their environment**. These agents **interact with the environment through trial and error** and **receive rewards** (positive or negative) **as feedback** to guide their learning process.

Reinforcement Learning (RL) focuses on decision-making, aiming to discover the best actions to maximize rewards in a given environment. Unlike supervised or unsupervised learning, where data is provided directly, RL relies on a trial-and-error approach to accumulate data.

In RL, algorithms learn by evaluating the outcomes of their actions and adjusting their behavior based on the feedback they receive. This feedback indicates whether an action was beneficial, neutral, or detrimental. RL is particularly useful for automated systems that need to make numerous small decisions independently, without human intervention.

Now you already know about the basic RL and several main elements of RL framework. The formal framework for RL borrows from the problem of optimal control of Markov Decision Processes (MDP). Think of this as a formal way to describe the decision-making problems in RL. It’s just a structured system where the outcome depends on the current state and the action taken. The main elements of RL system that already discussed form the example are:
- The agent or the learner
- The environment the agent interacts with
- The policy, simply a rule or strategy that the agent follows to decide which action to take in each state.
- The reward signal that the agent observes upon taking actions


<center><img style="max-width:40em;" src="/1-rl-fundamental/rl_con.png" alt="rl_con"></center>

The learning process in RL revolves around the interaction between an **agent** and its **environment**. At any given time step $t$, the agent observes the current **state** $S_t$ of the environment and then selects an **action** $A_t$ based on this state. Upon taking the action, the environment transitions to a new **state** $S_{t+1}$, and the agent receives a **reward** $R_{t+1}$ as feedback. The goal of the agent is to learn a policy $\pi(a|s)$ that maps states to actions in a way that maximizes the cumulative reward over time. The process repeats as the agent continuously interacts with the environment: observing the next state $S_{t+1}$, selecting the next action $A_{t+1}$, and receiving the next reward $R_{t+2}$. Through this cycle of **state** ($S_t$), **action** ($A_t$), **reward** ($R_{t+1}$), and **next state** ($S_{t+1}$), the agent learns to adjust its actions to maximize its long-term rewards, effectively learning the optimal behavior in the environment.

This RL loop always give a sequence of state, action, reward, and next state.

$$
\Large
S_0, A_0, R_1, S_1
$$

### How the Cycle Works Together:

1. **Observation:** The agent observes the current **state** of the environment.
2. **Decision:** Based on the current state, the agent selects an **action** to take.
3. **Interaction:** The agent takes the action, which affects the environment.
4. **Feedback:** The environment responds by providing a **reward** and a new **state** (next state).
5. **Update:** The agent receives the reward and observes the next state, using this information to update its strategy or policy.
6. **Repeat:** The cycle repeats with the agent in the new state, continuing to interact, learn, and improve.

### Example: Teaching a Robot to Navigate a Maze
- **Agent:** The robot.
- **Environment:** The maze.
- **State:** The robot’s current position in the maze.
- **Action:** The robot’s decision to move forward, turn left, or turn right.
- **Reward:** +10 if it moves closer to the exit, -1 for hitting a wall, +50 for finding the exit.
- **Next State:** The new position of the robot after taking an action.
- **Next Reward:** The reward based on the new position.

## Agent Goal
Imagine you're playing a video game where your goal is to score as many points as possible. In this game, every time you do something good, like collecting coins or defeating enemies, you earn points. But if you make a mistake, like falling into a pit or getting hit by an enemy, you lose points.

In Reinforcement Learning, the **agent** is like the character you're controlling in the game. The **goal of the agent** is to figure out the best way to play the game so that it can **earn the most points (rewards)** over time.

This kind of thing, can be called as the cumulative reward or expected reward. This cumulative reward, also known as the return, is often denoted as $G_t = R_{t+1} + R_{t+2} + \dots$, considering future rewards.

Maybe you have this kind of question:

> <b>Question</b> </br>
> Why does the agent aim to maximize the expected return?

The agent aims to maximize the expected return because this approach ensures the best long-term results. The expected return considers both immediate and future rewards, guiding the agent to make decisions that not only yield immediate gains but also enhance long-term benefits. By focusing on maximizing the expected return, the agent balances short-term rewards with future opportunities, ultimately optimizing its overall performance. This strategy helps the agent to consistently make decisions that lead to the highest total reward over time, improving its effectiveness and success in the environment.

The agent's focus on maximizing the expected return exemplifies the balance between short-term gains and long-term success - an approach that can inspire us in our own learning journeys. Just as the agent continuously adapts and refines its strategy, we too can strive to explore deeper, learn more, and improve over time. If this post has sparked your curiosity, I encourage you to dive deeper and share your thoughts or questions. Together, let's continue this journey of discovery.