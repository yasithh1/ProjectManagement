package com.example.Suppliers.Service;

import com.example.Suppliers.Model.UploadItem;
import com.example.Suppliers.Model.UploadItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UploadItemService
{
    @Autowired
    private UploadItemRepository uploadItemRepository;

    public UploadItem saveUploadItem(UploadItem item)
    {
        return uploadItemRepository.save(item);
    }
}
