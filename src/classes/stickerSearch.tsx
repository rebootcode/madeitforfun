import "./stickerSearch.css";
import $ from "jquery";
import {Deferred} from "./utility";
import {Modal} from "./modal";
import React from "react";
import ReactGiphySearchbox from "react-giphy-searchbox-stickers";
import {render} from "react-dom";

export class StickerSearch {
  public static async searchForStickerUrl () {
    const modal = new Modal();
    const div = $("<div/>");
    const modalPromise = modal.open({
      content: div,
      dismissable: true,
      fullscreen: true,
      title: "Sticker Search"
    }).then(() => null);

    const waitForShow = new Deferred<void>();
    modal.root.one("shown.bs.modal", () => {
      waitForShow.resolve();
    });
    await waitForShow;

    const defer = new Deferred<any>();

    const masonryConfig = [];
    for (let i = 1; i < 10; ++i) {
      const paddingLeftAndRight = 32;
      const imageWidth = 200;
      const gutter = 10;
      const width = i * imageWidth + (i - 1) * gutter + paddingLeftAndRight;
      masonryConfig.push({
        columns: i,
        gutter,
        imageWidth,
        mq: `${width}px`
      });
    }

    render(<ReactGiphySearchbox
      apiKey="dc6zaTOxFJmzC"
      urlKind="stickers"
      onSelect={(item) => defer.resolve(item)}
      gifListHeight={"calc(100vh - 160px)"}
      masonryConfig={masonryConfig}
      wrapperClassName={"center-div"}
    />, div.get(0));

    const result = await Promise.race([
      modalPromise,
      defer
    ]);
    render(<div></div>, div.get(0));
    modal.hide();
    if (!result) {
      return null;
    }
    return result.images.original.webp as string;
  }
}