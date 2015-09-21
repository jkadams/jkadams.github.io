import java.awt.Color;
import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.imageio.ImageIO;

/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Controller for the game, responsible for updating the game state and the view,
 * and generating the random values used for the game's response to each move.
 *
 * @author jkadams
 */

public class AndroidThreesController {

  static int HORIZONTAL_DELTA = 135;
  static int VERTICAL_DELTA = 180;
  static int HORIZONTAL_START = 101;
  static int VERTICAL_START = 310;
  static int HORIZONTAL_WIDTH = 113;
  static int VERTICAL_WIDTH = 135;
 
  private final PrintWriter out;

  private static final boolean DEBUG = false;
  private static final boolean SAVE_IMAGES = true;
  
  public MeldGame game;
  public Map<Integer, BufferedImage> tiles;
  public Map<Integer, BufferedImage> nextTiles;
  public AndroidThreesController() throws IOException {
    out = new PrintWriter(new FileWriter("StateImages.txt", true), true);
    this.game = null;

    BufferedImage img;
    tiles = new HashMap<Integer, BufferedImage>();
    for (int i = 0; i <= 3; i++) {
      img = ImageIO.read(new File("tile" + i + ".png"));
      tiles.put(i, img);
    }
    for (int i = 6; i <= 1536; i *= 2) {
      img = ImageIO.read(new File("tile" + i + ".png"));
      tiles.put(i, img);
    }
    nextTiles = new HashMap<Integer, BufferedImage>();
    for (int i = 1; i <= 3; i++) {
      img = ImageIO.read(new File("next" + i + ".png"));
      nextTiles.put(i, img);
    }
    img = ImageIO.read(new File("nextBonus.png"));
    nextTiles.put(MeldGame.NEXT_BONUS, img);
  }
  
  public static boolean executeCommand(String command) {
    Process p;
    int exit = -1;
    try {
      p = Runtime.getRuntime().exec(command);
      exit = p.waitFor();
    } catch (IOException e) {
      e.printStackTrace();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    if (exit != 0) {
      System.out.println("Error executing command: " + command);
      return false;
    }
    return true;
  }
  
  public static BufferedImage takeScreenshot() {
    try {
      boolean succeeded = executeCommand("adb shell /system/bin/screencap -p /sdcard/screenshot.png");
      if (!succeeded) return null;
      succeeded = executeCommand("adb pull /sdcard/screenshot.png screenshot.png");
      if (!succeeded) return null;
      
      
      BufferedImage img = null;
      img = ImageIO.read(new File("screenshot.png"));
      return img;
    } catch (IOException e) {
      e.printStackTrace();
      return null;
    }
  }
  
  public MeldGame createGameFromScreenshot() {
    BufferedImage screen = takeScreenshot();
    if (screen == null) {
      System.out.println("no screenshot :(");
      return null;
    }
    MeldGame game = new MeldGame();
    for (int r = 0; r < 4; r++) {
      for (int c = 0; c < 4; c++) {
        int x = HORIZONTAL_START + c * HORIZONTAL_DELTA;
        int y = VERTICAL_START + r * VERTICAL_DELTA;
        BufferedImage sub = screen.getSubimage(x, y, HORIZONTAL_WIDTH, VERTICAL_WIDTH);
        debugName = r+"-"+c;
        if (DEBUG) System.out.println("Recognizing tile " + r + ", " + c);
        int tile = recognizeTile(sub);
        if (tile != 0) {
          game.addPiece(r, c, tile);
        }
      }
    }
    
    BufferedImage nextTile = screen.getSubimage(332, 100, 56, 75);
    int nextValue = recognizeNextTile(nextTile);
    game.nextValue = nextValue;

    if (SAVE_IMAGES) {
      try {
        String fileName = "State" + System.currentTimeMillis() + ".png";
        ImageIO.write(screen, "png", new File(fileName));
        out.println(fileName + "," + game.pieces + "," + game.nextValue);
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    return game;
  }
  
  private static Integer findClosestImage(Map<Integer, BufferedImage> map, BufferedImage toCheck) {
    Integer bestImage = null;
    double min = Double.MAX_VALUE;
    for (Integer i : map.keySet()) {
      BufferedImage test = map.get(i);
      String tmp = debugName;
      debugName = debugName + "--" + i;
      double difference = findDifference(test, toCheck);
      debugName = tmp;
      if (DEBUG) System.out.println(i + ": " + difference);
      if (difference < min) {
        min = difference;
        bestImage = i;
      }
    }
    return bestImage;
  }
  
  private static float[] averageColor(float[][] pixels) {
    float[] avg = new float[3];
    for (int i = 0; i < pixels.length; i++) {
      for (int j = 0; j < 3; j++) {
        avg[j] += pixels[i][j];
      }
    }
    for (int j = 0; j < 3; j++) {
      avg[j] /= pixels.length;
    }
    return avg;
  }
  
  private static double colorDifference(float[] a, float[] b) {
    double d = 0;
    for (int i = 0; i < 3; i++) {
      d += Math.abs(a[i] - b[i]);
    }
    return d;
  }

  // I really want to find the primary background color and number color, and normalize them to true/false, and compare those boolean arrays.
  // This is sorta like that.
  private static double findDifference(BufferedImage a, BufferedImage b) {
    double sum = 0;
    int width = Math.min(a.getWidth(), b.getWidth());
    int height = Math.min(a.getHeight(), b.getHeight());
    int[] aPixels = a.getRGB(0, 0, width, height, null, 0, width);
    int[] bPixels = b.getRGB(0, 0, width, height, null, 0, width);
    BufferedImage f = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
    int dims = width * height;
    float[][] aHSB = new float[dims][3];
    float[][] bHSB = new float[dims][3];
    int[] arr;
    if (DEBUG) arr = new int[width * height];
    for (int i = 0; i < dims; i++) {
      Color aColor = new Color(aPixels[i], true);
      Color bColor = new Color(bPixels[i], true);
      Color.RGBtoHSB(aColor.getRed(), aColor.getGreen(), aColor.getBlue(), aHSB[i]);
      Color.RGBtoHSB(bColor.getRed(), bColor.getGreen(), bColor.getBlue(), bHSB[i]);
    }
    float[] aAverage = averageColor(aHSB);
    float[] bAverage = averageColor(bHSB);
    double difference = colorDifference(aAverage, bAverage);
    
    for (int i = 0; i < dims; i++) {
      boolean interestingA = false, interestingB = false;
      if (colorDifference(aHSB[i], aAverage) > 0.4) interestingA = true;
      if (colorDifference(bHSB[i], bAverage) > 0.4) interestingB = true;
      if (interestingA != interestingB) {
        sum += 1;
        if (DEBUG) arr[i] = 255 << 8;
      } else if (interestingA) {
        if (DEBUG) arr[i] = (255); // both interesting and same
      } else {
        if (DEBUG) arr[i] = 255 << 16; // red if both are uninteresting
      }
    }
    if (DEBUG) {
      f.setRGB(0, 0, width, height, arr, 0, width);
      try {
        ImageIO.write(a, "png", new File("comp" + debugName + "A.png"));
        ImageIO.write(b, "png", new File("comp" + debugName + "B.png"));
        ImageIO.write(f, "png", new File("comp" + debugName + "C.png"));
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    if (difference > 0.5) {
      return 1000000;
    }
    return sum;
  }

  static String debugName = "";
  private int recognizeNextTile(BufferedImage nextTile) {
    Integer best = findClosestImage(nextTiles, nextTile);
    if (best == null) {
      System.out.println("Couldn't find a good next tile");
    }
    return best;
  }

  public int recognizeTile(BufferedImage tile) {
    Integer best = findClosestImage(tiles, tile);
    if (best == null) {
      System.out.println("Couldn't find a good tile");
    }
    return best;
  }
  
  public void startNewGame() {
    this.game = createGameFromScreenshot();
    game.printBoard();
  }
  
  public void swipeInDirection(MeldGame.Move m) {
    String command;
    switch (m) {
      case LEFT:
        command = "adb shell input touchscreen swipe 400 600 200 600 100";
        break;
      case UP:
        command = "adb shell input touchscreen swipe 400 600 400 400 100";
        break;
      case RIGHT:
        command = "adb shell input touchscreen swipe 400 600 600 600 100";
        break;
      case DOWN:
        command = "adb shell input touchscreen swipe 400 600 400 800 100";
        break;
      default:
        throw new IllegalArgumentException("Must pass in a valid direction");
    }
    executeCommand(command);
  }

  public boolean move(MeldGame.Move m) {
    long startTime = System.nanoTime();
    swipeInDirection(m);
    try {
      Thread.sleep(1200);
  
      long endTime = System.nanoTime();
      long elapsedTime = endTime - startTime;
      if (AndroidPlayer.DEBUG) System.out.printf("%s %10fs%n", "Swiping", elapsedTime / 1.0e9d);
      startTime = System.nanoTime();
      
      MeldGame newGame = createGameFromScreenshot();
  
      endTime = System.nanoTime();
      elapsedTime = endTime - startTime;
      if (AndroidPlayer.DEBUG) System.out.printf("%s %10fs%n", "Reading game", elapsedTime / 1.0e9d);
      if (newGame.equals(this.game)) {
        Thread.sleep(1000);
        System.out.println("Nothing changed doing " + m);
      }
      if (newGame.equals(this.game)) {
        System.out.println("Nothing changed doing " + m + " again");
        throw new IllegalStateException("Game didn't move.");
      }
      MeldGame testGame = this.game.copy();
      testGame.move(m);
      
      this.game = newGame;
      int match = 0;
      for (int r = 0; r < 4; r++) {
        for (int c = 0; c < 4; c++) {
          if (testGame.getPiece(r, c) == newGame.getPiece(r, c)) {
            match++;
          }
        }
      }
      if (match != 15) {
        System.out.println("Expected game state (aside from new values)");
        testGame.printBoard();
        System.out.println("Game from screenshot");
        newGame.printBoard();
        out.println("wrong");
//        throw new IllegalStateException("Game did not match.");
      }
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    return true;
  }
}
