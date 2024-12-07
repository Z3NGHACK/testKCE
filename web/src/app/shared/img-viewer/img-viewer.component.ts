import { Component, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'helpers-img-viewer',
    standalone: true,
    templateUrl: './img-viewer.component.html',
    styleUrls: ['./img-viewer.component.scss'],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        FormsModule,
        MatInputModule,
        MatProgressSpinnerModule
    ]
})
export class HeplersImgViewerComponent implements AfterViewInit {
    zoom: number = 0.8;
    normalZoom: number = 1;
    maxZoom: number = 4;
    minZoom: number = 0.3;
    zoomStep: number = 0.1;
    originalWidth: number;
    originalHeight: number;
    imgWidth: number;
    imgHeight: number;
    containerWidth: number;
    isLoading: boolean = true; // Loading state

    @ViewChild('container') containerRef: ElementRef;

    constructor(@Inject(MAT_DIALOG_DATA) public file: { url: string, title: string }) { }

    ngOnInit() {
        const img = new Image();
        img.src = this.file.url;
        img.onload = () => {
            this.originalWidth = img.width;
            this.originalHeight = img.height;
            this.updateImageSize();
            this.isLoading = false; // Hide the loading spinner
        };
    }

    ngAfterViewInit() {
        this.containerWidth = this.containerRef.nativeElement.clientWidth;
    }

    downloadImage(): void {
        fetch(this.file.url, { mode: 'cors' })
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                const url = window.URL.createObjectURL(blob);
                link.href = url;
                link.download = this.file.title || 'downloaded-image';
                link.click();
                window.URL.revokeObjectURL(url); // Clean up URL object
            })
            .catch(error => {
                console.error('Error downloading the image:', error);
            });
    }

    zoomIn(): void {
        const newZoom = this.zoom + this.zoomStep;
        if (newZoom <= this.maxZoom && (this.originalWidth * newZoom) <= this.containerWidth + 200) {
            this.zoom = newZoom;
            this.updateImageSize();
        }
    }

    zoomOut(): void {
        const newZoom = this.zoom - this.zoomStep;
        if (newZoom >= this.minZoom) {
            this.zoom = newZoom;
            this.updateImageSize();
        }
    }

    updateImageSize(): void {
        this.imgWidth = this.originalWidth * this.zoom;
        this.imgHeight = this.originalHeight * this.zoom;
    }

    get canZoomIn(): boolean {
        const newZoom = this.zoom + this.zoomStep;
        return this.zoom <= this.maxZoom && (this.originalWidth * newZoom) <= this.containerWidth + 200;
    }

    get canZoomOut(): boolean {
        const newZoom = this.zoom - this.zoomStep;
        return newZoom >= this.minZoom;
    }
}
