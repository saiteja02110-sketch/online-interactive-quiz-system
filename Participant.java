package com.quiz.model;

public class Participant {
    private String name;
    private int score = 0;
    private double totalTime = 0; // in seconds

    public Participant(String name) { this.name = name; }
    public String getName() { return name; }
    public int getScore() { return score; }
    public double getTotalTime() { return totalTime; }
    public void addScore(int points) { this.score += points; }
    public void addTime(double time) { this.totalTime += time; }
}
