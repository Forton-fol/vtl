import React, { useState } from "react";
import Dropdown from "react-bootstrap/cjs/Dropdown";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useCharSheetStorage } from "../../../../charSheets/root/services/storageAdapter";

interface ExportPdfButtonProps {
  className?: string;
}

export function ExportPdfButton(props: ExportPdfButtonProps): JSX.Element {
  const { t } = useTranslation();
  const { className } = props;
  const { charSheet } = useCharSheetStorage();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPdf = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // Находим все страницы листа персонажа
      const pages = document.querySelectorAll('.charsheet-page');
      console.log('Found pages:', pages.length);
      
      // Если не найдены специфичные страницы, ищем основной контент
      let pageElements: Element[] = [];
      if (pages.length === 0) {
        console.log('No .charsheet-page found, trying fallback');
        // Ищем контейнер с листом персонажа
        const mainContent = document.querySelector('.tw-flex-grow-1') as HTMLElement;
        if (mainContent) {
          pageElements = [mainContent];
          console.log('Using fallback element');
        }
      } else {
        pageElements = Array.from(pages);
        console.log('Using charsheet-page elements:', pageElements.length);
      }

      if (pageElements.length === 0) {
        console.error('No pages found for PDF export');
        alert('Не удалось найти страницы для экспорта');
        setIsGenerating(false);
        return;
      }

      // Скрываем панель управления для экспорта
      const controlPanel = document.querySelector('.ControlPanel') as HTMLElement;
      const originalDisplay = controlPanel?.style.display;
      if (controlPanel) {
        controlPanel.style.display = 'none';
      }

      // Добавляем класс для PDF экспорта (скроет навигацию и другие UI элементы)
      document.body.classList.add('pdf-export-mode');

      // Временно убираем фон со страниц
      const originalBackgrounds: string[] = [];
      const originalBackgroundImages: string[] = [];
      pageElements.forEach((element) => {
        const el = element as HTMLElement;
        originalBackgrounds.push(el.style.backgroundColor);
        originalBackgroundImages.push(el.style.backgroundImage);
        el.style.backgroundColor = 'white';
        el.style.backgroundImage = 'none';
      });

      // Размеры A4 в мм
      const a4Width = 210;
      const a4Height = 297;
      
      // Создаем PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Обрабатываем каждую страницу
      for (let i = 0; i < pageElements.length; i++) {
        console.log(`Processing page ${i + 1} of ${pageElements.length}`);
        const pageElement = pageElements[i] as HTMLElement;
        
        // Создаем canvas из страницы с меньшим scale для уменьшения размера
        const canvas = await html2canvas(pageElement, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1200, // Фиксированная ширина для консистентности
        });
        
        console.log(`Canvas created for page ${i + 1}: ${canvas.width}x${canvas.height}`);

        // Получаем размеры canvas
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        if (imgWidth === 0 || imgHeight === 0) {
          console.error(`Invalid canvas dimensions for page ${i + 1}`);
          continue;
        }
        
        // Вычисляем соотношение сторон
        const ratio = imgWidth / imgHeight;
        
        // Подгоняем под A4 с сохранением пропорций
        let finalWidth = a4Width;
        let finalHeight = a4Width / ratio;
        
        // Если высота превышает A4, масштабируем по высоте
        if (finalHeight > a4Height) {
          finalHeight = a4Height;
          finalWidth = a4Height * ratio;
        }
        
        // Проверяем валидность размеров
        if (finalWidth <= 0 || finalHeight <= 0 || !isFinite(finalWidth) || !isFinite(finalHeight)) {
          console.error(`Invalid dimensions calculated for page ${i + 1}: ${finalWidth}x${finalHeight}`);
          continue;
        }
        
        // Центрируем изображение на странице
        const xOffset = (a4Width - finalWidth) / 2;
        const yOffset = (a4Height - finalHeight) / 2;
        
        console.log(`Page ${i + 1} dimensions: ${finalWidth.toFixed(2)}x${finalHeight.toFixed(2)} at (${xOffset.toFixed(2)}, ${yOffset.toFixed(2)})`);

        // Конвертируем canvas в изображение с меньшим качеством для уменьшения размера
        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        
        // Если это не первая страница, добавляем новую страницу
        if (i > 0) {
          pdf.addPage();
        }
        
        // Добавляем изображение в PDF с валидными координатами
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
      }

      // Восстанавливаем фон страниц
      pageElements.forEach((element, index) => {
        const el = element as HTMLElement;
        el.style.backgroundColor = originalBackgrounds[index];
        el.style.backgroundImage = originalBackgroundImages[index];
      });

      // Убираем класс PDF режима
      document.body.classList.remove('pdf-export-mode');

      // Восстанавливаем панель
      if (controlPanel) {
        controlPanel.style.display = originalDisplay || '';
      }

      // Имя файла из имени персонажа или дефолтное
      const characterName = charSheet.profile.name || 'character';
      const fileName = `${characterName.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}.pdf`;
      
      console.log(`Saving PDF as: ${fileName}`);
      
      // Скачиваем PDF
      pdf.save(fileName);
      
      console.log('PDF saved successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Убираем класс PDF режима
      document.body.classList.remove('pdf-export-mode');
      // Восстанавливаем панель и фон в случае ошибки
      const controlPanel = document.querySelector('.ControlPanel') as HTMLElement;
      if (controlPanel) {
        controlPanel.style.display = '';
      }
      // Восстанавливаем фон
      const pages = document.querySelectorAll('.charsheet-page');
      if (pages.length > 0) {
        Array.from(pages).forEach((element) => {
          const el = element as HTMLElement;
          el.style.backgroundColor = '';
          el.style.backgroundImage = '';
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dropdown.Item
      as="button"
      className={className}
      type="button"
      onClick={handleExportPdf}
      disabled={isGenerating}
    >
      {isGenerating ? t("buttons.generating-pdf", "Генерация PDF...") : t("buttons.export-pdf", "Скачать PDF")}
    </Dropdown.Item>
  );
}
