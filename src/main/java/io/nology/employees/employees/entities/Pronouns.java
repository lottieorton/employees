package io.nology.employees.employees.entities;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Pronouns {
    HE_HIM("He/Him"),
    SHE_HER("She/Her"),
    THEY_THEM("They/Them"),
    HE_THEY("He/They"),
    SHE_THEY("She/They"),
    XE_XEM("Xe/Xem"),
    ZE_ZIR("Ze/Zir"),
    ANY_ALL("Any/All"),
    OTHER("Other"),
    PREFER_NOT_TO_SAY("Prefer not to say");

    private final String label;

    Pronouns(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public static Pronouns fromLabel(String label) {
        if (label == null) {
            return null;
        }
        for (Pronouns pronoun : Pronouns.values()) {
            if (pronoun.getLabel().equalsIgnoreCase(label.trim())) {
                return pronoun;
            }
        }
        throw new IllegalArgumentException("Unknown pronoun label: " + label);
    }
}