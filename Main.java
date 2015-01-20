import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.awt.image.DataBufferInt;
import java.io.File;
import java.io.IOException;
import java.util.*;


public class Main {

    public static int getGreyLevel (int pixel) {

        int r = (pixel)&0xFF;
        int g = (pixel>>8)&0xFF;
        int b = (pixel>>16)&0xFF;

        if (!(r == g && g == b)) {
            return -1;
        }

        return (pixel)&0xFF;
    }

    public static int toRGB (int greyLevel) {
        return ((greyLevel&0x0ff)<<16)|((greyLevel&0x0ff)<<8)|(greyLevel&0x0ff);
    }

    public static void saveImage(JPanel panel, String path) {
        BufferedImage img = new BufferedImage(panel.getWidth(), panel.getHeight(), BufferedImage.TYPE_INT_RGB);
        panel.paint(img.getGraphics());
        try {
            ImageIO.write(img, "png", new File(path));

        } catch (Exception e) {
        }
    }

    public static void main(String[] args) {

        String imgPath = args[0];

        BufferedImage img = null;
        try {
            img = ImageIO.read(new File(imgPath));
        }
        catch (IOException e) {
            System.out.print("ERR-READ");
        }

        int L = 256;
        int[] h = new int[L];

        for (int i = 0; i < img.getWidth(); i++) {
            for (int j = 0; j < img.getHeight(); j++) {
                int pixel = img.getRGB(i, j);
                int greyColor = getGreyLevel(pixel);
                if (greyColor == -1) {
                    System.out.print("ERR-NOT-GREY");
                    System.exit(-1);
                }
                h[greyColor]++;
            }
        }

        int[] hc = new int[L];
        int[] hNew = new int[L];
        hc[0] = h[0];

        for (int i = 1; i < L; i++) {
            hc[i] = hc[i - 1] + h[i];
        }
		
        for (int i = 0; i < img.getWidth(); i++) {
            for (int j = 0; j < img.getHeight(); j++) {
                int pixel = img.getRGB(i, j);
                int greyColor = getGreyLevel(pixel);

                int newGreyColor = (int) Math.round
                        (((double) (hc[greyColor] - hc[0]) / (double) (img.getHeight() * img.getWidth() - hc[0])) * (L - 1));

                hNew[newGreyColor]++;

                int rgbColor = toRGB(newGreyColor);
                img.setRGB(i, j, rgbColor);

            }
        }

        File outputfile = new File(imgPath);
        try {
            ImageIO.write(img, "jpg", outputfile);
        } catch (IOException e) {
            System.out.print("ERR-WRITE");
        }

        JPanel before = new Histogram(h);
        JPanel after = new Histogram(hNew);

        before.setSize(500, 500);
        after.setSize(500, 500);

        String[] split = imgPath.split("\\.");
        String imgName = "";

        for (int i = 0; i < split.length; i++) {
            if (i != split.length - 1) {
                imgName += split[i];
            }
        }

        saveImage(before, imgName + "_before.png");
        saveImage(after, imgName + "_after.png");

        System.out.print("OK-" + imgName);

    }
}
