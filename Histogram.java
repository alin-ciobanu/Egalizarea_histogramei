import java.awt.Color;
import java.awt.Graphics;
import javax.swing.*;

public class Histogram extends JPanel {

    int[] bins = new int[256];
    public Histogram(int[] pbins) {
        bins = pbins;
        this.setOpaque(true);
        this.setBackground(Color.WHITE);
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {

        g.setColor(Color.BLACK);
        super.paintComponent(g);

        int max = 0;

        for (int i = 0; i < 256; i++) {
            if (bins[i] > max) {
                max = bins[i];
            }
        }

        int unit = max / 256;

        for (int i = 0; i < 256; i++) {
            int startX = i + 10;
            int y = 430;
            g.drawLine(startX + i, y - (bins[i] / unit), startX + i, y);
        }

    }

}