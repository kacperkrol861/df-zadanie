# DataFlow

##  Stack

- Vue 3 (Composition API)
- TypeScript
- Pinia (state management)
- Vuestic UI (komponenty UI)
- Vite (build tool)
- Mockowane dane są implementowane w warstwie useMockApi jako in-memory backend symulujący zachowanie API.

---

##  Uruchomienie projektu

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod:

```
http://localhost:5173
```

---

##  Opis projektu

Aplikacja symuluje system do uruchamiania skanów danych, generowania raportów oraz przeglądania wyników analitycznych.

Głównym celem było zaprojektowanie intuicyjnego przepływu onboardingowego oraz spójnego dashboardu do pracy z danymi.

---

##  Decyzje projektowe

Największy nacisk położyłem na onboarding, ponieważ to on prowadzi użytkownika do pierwszego realnego efektu w systemie.

### Onboarding

- Składa się z 5 kroków  
- Każdy krok jasno pokazuje, co użytkownik ma zrobić  
- Proces prowadzi od pustego konta do uruchomionego skanu  
- Skupienie na prostocie i redukcji decyzji użytkownika  

### Dashboard

- Utrzymany w jasnej, biało-niebieskiej stylistyce  
- Kolory dobrane pod czytelność i poczucie “porządku”  
- KPI + wykresy + ostatnia aktywność w jednym miejscu  

### Skanowanie

- Lista skanów z widocznym progress barem  
- Widok szczegółów skanu z logami i wynikami  
- Możliwość ręcznego uruchomienia skanu (dla queued)  
- Symulacja procesu w czasie rzeczywistym (mock API)  

### Raporty

- Lista raportów z podglądem statusu  
- Możliwość generowania nowego raportu  
- Statusy: generating, ready, failed  
- Widok szczegółowy z sekcjami i czytelną typografią  

---

##  Identyfikacja wizualna

Interfejs opiera się na:

- jasnym, minimalistycznym UI  
- dominacji bieli i niebieskiego jako koloru akcentowego  
- lekkich kartach i dużej przestrzeni między elementami  
- czytelnej hierarchii informacji  

---

##  Świadome kompromisy

- Brak backendu → całość oparta o mock API  
- Symulacja procesów zamiast realnych jobów  
- Ograniczona liczba wykresów (priorytet UX nad analizą danych)  
- Uproszczona logika błędów i retry  

---

##  Co bym dodał mając więcej czasu

- Poprawiłbym sekcję raportów, aby działała w pełni w trybie “live” (automatyczne odświeżanie statusów bez ręcznego refreshu)  
- Dodałbym bardziej szczegółowy widok raportu z lepszą strukturą sekcji (np. podział na metryki, wykresy i rekomendacje zamiast tylko tekstu)  
- Rozbudowałbym system statusów raportów o dodatkowe etapy (np. processing / finalizing), aby lepiej oddać realny proces generowania  
- Dodałbym lepsze wizualne feedbacki dla zmian statusów (animacje, highlight zmian, loader w kartach)  
```
