package com.quiz.controller;

import com.quiz.model.Participant;
import com.google.gson.Gson;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.*;

@WebServlet("/quiz-api")
public class QuizServlet extends HttpServlet {
    private static List<Participant> participants = new ArrayList<>();

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String action = request.getParameter("action");

        if ("init".equals(action)) {
            participants.clear();
            String[] names = request.getParameterValues("names[]");
            for (String name : names) {
                participants.add(new Participant(name));
            }
        } else if ("submitScore".equals(action)) {
            String name = request.getParameter("name");
            int points = Integer.parseInt(request.getParameter("points"));
            double time = Double.parseDouble(request.getParameter("time"));

            for (Participant p : participants) {
                if (p.getName().equals(name)) {
                    p.addScore(points);
                    p.addTime(time);
                }
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Sort by Score DESC, then Time ASC
        participants.sort((p1, p2) -> {
            if (p2.getScore() != p1.getScore()) return p2.getScore() - p1.getScore();
            return Double.compare(p1.getTotalTime(), p2.getTotalTime());
        });

        String json = new Gson().toJson(participants);
        response.setContentType("application/json");
        response.getWriter().write(json);
    }
}
