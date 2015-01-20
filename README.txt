Modificarea histogramelor pentru o fotografie

Student: Ciobanu Alin Emanuel
Grupa: 342 C2


Aplicatia se poate testa in doua moduri:

1. Online la http://178.62.196.56:9066/jpeg/
Se uploadeaza o poza jpeg (cateva exemple pot fi gasite in folderul inputs).
Serverul va returna 3 poze: poza modificata si cele doua histograme (inainte si dupa).
Exista posibilitatea ca browserul sa adauge un dialog care sa atentioneze ca site-ul incearca sa descarce mai multe fisiere.
Eu am testat cu Opera si Chrome. 


2. Local. Pasii ce trebuie urmati pentru a rula aplicatia (pe Windows) sunt detaliati in cele ce urmeaza.

a. Se instaleaza java jre si java jdk. Adresele: https://java.com/en/download/ si http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html

b. Se instaleaza NodeJS de la adresa http://nodejs.org/download/

c. Se deschide un terminal (cmd sau altul) si se compileaza cele doua surse java. Daca javac se afla in PATH, nu e necesara specificarea intregului path catre executabil. Daca nu, trebuie ca toata calea catre javac sa fie specificata. De obicei, java se afla in C:\Program Files\Java\jdk_versiune\bin.
Exemplu de compilare:
"C:\Program Files\Java\jdk1.7.0_71\bin\javac" Main.java
"C:\Program Files\Java\jdk1.7.0_71\bin\javac" Histogram.java

d. Cu terminalul deschis, se executa "npm install" in folderul root proiectului. Daca apar erori, se recomanda rularea terminalului ca administrator. 

e. Aplicatia este gata de a fi rulata. "node server.js" va porni serverul pe portul 9066. Daca portul este deja folosit, el poate fi schimbat din fisierul server.js (var PORT = 9066;)

f. Aplicatia se acceseaza din browser (de preferat Chrome sau Opera) la adresa http://localhost:9066
