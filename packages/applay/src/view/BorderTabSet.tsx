import * as React from "react";
import DockLocation from "../DockLocation";
import Border from "../model/BorderNode";
import TabNode from "../model/TabNode";
import {BorderButton} from "./BorderButton";
import FlexLayout from "./FlexLayout";

/** @hidden @internal */
export interface IBorderTabSetProps {
    border:Border;
    layout:FlexLayout;
}

/** @hidden @internal */
export class BorderTabSet extends React.Component<IBorderTabSetProps, any> {
    toolbarRef?: HTMLDivElement;

    render() {
        const cm = this.props.layout.getClassName;
        const border = this.props.border;
        const style = border.getTabHeaderRect()!.styleWithPosition({});
        if (border.getLocation().getName() === "bottom") {
            style.width = `${parseInt(style.width, 10) + 12}px`;
        } else if(border.getLocation().getName() === "left") {
            style.height = `${parseInt(style.height, 10) + 6}px`;

        } else if(border.getLocation().getName() === "right") {
            style.height = `${parseInt(style.height, 10) + 6}px`;

        }

        const tabs = [];
        if (border.getLocation() !== DockLocation.LEFT) {
            for (let i = 0; i < border.getChildren().length; i++) {
                const isSelected = border.getSelected() === i;
                const child = border.getChildren()[i] as TabNode;
                tabs.push(<BorderButton layout={this.props.layout}
                                        border={border.getLocation().getName()}
                                        node={child}
                                        key={child.getId()}
                                        selected={isSelected}/>);
            }
        }
        else {
            for (let i = border.getChildren().length - 1; i >= 0; i--) {
                const isSelected = border.getSelected() === i;
                const child = border.getChildren()[i] as TabNode;
                tabs.push(<BorderButton layout={this.props.layout}
                                        border={border.getLocation().getName()}
                                        node={child}
                                        key={child.getId()}
                                        selected={isSelected}/>);
            }
        }

        let borderClasses = cm("flexlayout__border_" + border.getLocation().getName());
        if (this.props.border.getClassName() !== undefined) {
            borderClasses += " " + this.props.border.getClassName();
        }

        // allow customization of tabset right/bottom buttons
        let buttons:any[] = [];
        const renderState = {headerContent:{}, buttons};
        this.props.layout.customizeTabSet(border, renderState);
        buttons = renderState.buttons;

        const toolbar = <div
            key="toolbar"
            ref={toolbar2=>this.toolbarRef = (toolbar2===null)?undefined:toolbar2}
            className={cm("flexlayout__border_toolbar_" + border.getLocation().getName())}>
            {buttons}
        </div>;

        return <div
            style={style}
            className={borderClasses}>
            <div className={cm("flexlayout__border_inner_" + border.getLocation().getName())}>
                {tabs}
            </div>
            {toolbar}
        </div>;
    }
}

export default BorderTabSet;